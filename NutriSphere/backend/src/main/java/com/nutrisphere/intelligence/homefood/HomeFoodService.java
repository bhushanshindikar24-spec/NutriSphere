package com.nutrisphere.intelligence.homefood;

import com.nutrisphere.intelligence.homefood.*;
import com.nutrisphere.nutrition.assessment.AssessmentRepository;
import com.nutrisphere.nutrition.assessment.NutritionAssessment;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.food.FoodRepository;
import com.nutrisphere.patient.PatientProfile;
import com.nutrisphere.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeFoodService {
    private final HomeFoodInventoryRepository inventoryRepo;
    private final FoodRepository foodRepo;
    private final DietPlanRepository planRepo;
    private final PatientRepository patientRepo;
    private final AssessmentRepository assessmentRepo;
    private final DietPlanMealRepository dietPlanMealRepo;
    private final MealItemRepository mealItemRepo;

    @Transactional
    public HomeFoodInventory addToInventory(Long patientUserId, String foodName, Double quantityG, String unit, Long foodItemId, String category) {
        HomeFoodInventory item = HomeFoodInventory.builder()
            .patientUserId(patientUserId).foodName(foodName)
            .quantityG(quantityG).unit(unit).foodItemId(foodItemId)
            .category(category).build();
        return inventoryRepo.save(item);
    }

    public List<HomeFoodInventory> getInventory(Long patientUserId) {
        return inventoryRepo.findByPatientUserIdAndAvailableTrue(patientUserId);
    }

    @Transactional
    public void removeFromInventory(Long itemId, Long patientUserId) {
        inventoryRepo.findById(itemId).ifPresent(item -> {
            if (item.getPatientUserId().equals(patientUserId)) {
                item.setAvailable(false);
                inventoryRepo.save(item);
            }
        });
    }

    public List<HomeFoodSuggestion> generateSuggestions(Long patientUserId) {
        List<HomeFoodInventory> inventory = inventoryRepo.findByPatientUserIdAndAvailableTrue(patientUserId);
        if (inventory.isEmpty()) return List.of();

        var plan = planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).orElse(null);
        Optional<PatientProfile> profileOpt = patientRepo.findByUserId(patientUserId);
        List<NutritionAssessment> assessments = assessmentRepo.findByPatientUserIdOrderByAssessmentDateDesc(patientUserId);

        Set<String> patientAllergies = new HashSet<>();
        profileOpt.ifPresent(p -> {
            if (p.getAllergies() != null && !p.getAllergies().isBlank()) {
                Arrays.stream(p.getAllergies().split("[,;]"))
                    .map(String::trim).map(String::toLowerCase).filter(s -> !s.isEmpty())
                    .forEach(patientAllergies::add);
            }
        });
        if (!assessments.isEmpty()) {
            String fa = assessments.get(0).getFoodAllergies();
            if (fa != null && !fa.isBlank()) {
                Arrays.stream(fa.split("[,;]"))
                    .map(String::trim).map(String::toLowerCase).filter(s -> !s.isEmpty())
                    .forEach(patientAllergies::add);
            }
        }

        List<String> availableNames = inventory.stream()
            .map(i -> i.getFoodName().toLowerCase())
            .collect(Collectors.toList());

        Set<String> approvedPlanIngredients = getApprovedPlanIngredients(plan);
        List<HomeFoodSuggestion> candidateSuggestions = new ArrayList<>();

        boolean hasEggs = availableNames.stream().anyMatch(n -> n.contains("egg"));
        boolean hasBread = availableNames.stream().anyMatch(n -> n.contains("bread") || n.contains("toast"));
        boolean hasMilk = availableNames.stream().anyMatch(n -> n.contains("milk") || n.contains("yogurt"));
        boolean hasVeg = availableNames.stream().anyMatch(n -> n.contains("vegetable") || n.contains("spinach") || n.contains("tomato"));
        boolean hasRice = availableNames.stream().anyMatch(n -> n.contains("rice"));
        boolean hasProtein = availableNames.stream().anyMatch(n -> n.contains("chicken") || n.contains("fish") || n.contains("lentil") || n.contains("dal"));

        if (hasEggs && hasBread) {
            candidateSuggestions.add(createSuggestion("Eggs on Toast", "BREAKFAST",
                List.of("Eggs", "Bread"), "Scramble or boil eggs, serve on toast",
                matchesPlan(List.of("Eggs", "Bread"), approvedPlanIngredients)));
        }
        if (hasMilk && hasBread) {
            candidateSuggestions.add(createSuggestion("Milk and Toast", "BREAKFAST",
                List.of("Milk", "Bread"), "Warm milk with toasted bread",
                matchesPlan(List.of("Milk", "Bread"), approvedPlanIngredients)));
        }
        if (hasRice && hasProtein && hasVeg) {
            candidateSuggestions.add(createSuggestion("Rice Bowl with Protein", "LUNCH",
                List.of("Rice", "Protein source", "Vegetables"), "Cook rice, add protein and vegetables",
                matchesPlan(List.of("Rice", "Protein source", "Vegetables"), approvedPlanIngredients)));
        }
        if (hasVeg && hasProtein) {
            candidateSuggestions.add(createSuggestion("Protein and Vegetable Stir Fry", "DINNER",
                List.of("Protein source", "Vegetables"), "Quick stir fry with available protein and vegetables",
                matchesPlan(List.of("Protein source", "Vegetables"), approvedPlanIngredients)));
        }

        if (candidateSuggestions.isEmpty()) {
            candidateSuggestions.add(createSuggestion("Custom Meal from Available Items", "ANY",
                availableNames,
                "Combine available ingredients. Nutrition values depend on logged food data; consult dietitian for specific proportions.",
                false));
        }

        return candidateSuggestions.stream().filter(s -> {
            String nameLower = s.getMealName().toLowerCase();
            List<String> ingredientsLower = s.getIngredients().stream()
                .map(String::toLowerCase).collect(Collectors.toList());

            for (String allergy : patientAllergies) {
                if (nameLower.contains(allergy)) return false;
                for (String ingredient : ingredientsLower) {
                    if (ingredient.contains(allergy)) return false;
                }
            }
            s.setClinicalSafetyValidated(false);
            if (!patientAllergies.isEmpty()) {
                s.setNutritionNote(s.getNutritionNote()
                    + " Allergy-name filtering was applied; clinical validation still requires dietitian review.");
            }
            return true;
        }).collect(Collectors.toList());
    }

    private HomeFoodSuggestion createSuggestion(String name, String type, List<String> ingredients,
            String prep, boolean matchesPlan) {
        HomeFoodSuggestion s = new HomeFoodSuggestion();
        s.setMealName(name);
        s.setMealType(type);
        s.setIngredients(ingredients);
        s.setPreparationNotes(prep);
        s.setMatchesDietPlan(matchesPlan);
        s.setEstimatedCalories(0);
        s.setEstimatedProteinG(0);
        s.setClinicalSafetyValidated(false);
        s.setNutritionNote(matchesPlan
            ? "Ingredient names match the approved plan; dietitian review is still required."
            : "Heuristic home-food suggestion; nutrition values are not calculated from a complete recipe.");
        return s;
    }

    private Set<String> getApprovedPlanIngredients(DietPlan plan) {
        if (plan == null) return Set.of();
        Set<String> names = new HashSet<>();
        for (DietPlanMeal meal : dietPlanMealRepo.findByDietPlanIdOrderBySortOrder(plan.getId())) {
            for (MealItem item : mealItemRepo.findByDietPlanMealId(meal.getId())) {
                if (item.getFoodName() != null) names.add(item.getFoodName().toLowerCase());
            }
        }
        return names;
    }

    private boolean matchesPlan(List<String> ingredients, Set<String> approvedNames) {
        if (approvedNames.isEmpty()) return false;

        return ingredients.stream().allMatch(ingredient -> {
            String token = ingredient.toLowerCase();
            if (token.equals("protein source")) {
                return approvedNames.stream().anyMatch(n ->
                    n.contains("chicken") || n.contains("fish") || n.contains("egg") ||
                    n.contains("lentil") || n.contains("dal") || n.contains("paneer") || n.contains("tofu"));
            }
            if (token.equals("vegetables")) {
                return approvedNames.stream().anyMatch(n ->
                    n.contains("vegetable") || n.contains("spinach") || n.contains("tomato") ||
                    n.contains("carrot") || n.contains("broccoli"));
            }
            return approvedNames.stream().anyMatch(n -> n.contains(token) || token.contains(n));
        });
    }
}
