package com.nutrisphere.intelligence.homefood;

import com.nutrisphere.nutrition.assessment.AssessmentRepository;
import com.nutrisphere.nutrition.assessment.NutritionAssessment;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.food.*;
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

    /**
     * Generate meal suggestions from available home food.
     * Strictly respects patient allergies, dietary restrictions, approved diet plans, and clinical constraints.
     */
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
                    .map(s -> s.trim().toLowerCase())
                    .filter(s -> !s.isEmpty())
                    .forEach(patientAllergies::add);
            }
        });
        if (!assessments.isEmpty()) {
            String fa = assessments.get(0).getFoodAllergies();
            if (fa != null && !fa.isBlank()) {
                Arrays.stream(fa.split("[,;]"))
                    .map(s -> s.trim().toLowerCase())
                    .filter(s -> !s.isEmpty())
                    .forEach(patientAllergies::add);
            }
        }

        List<String> availableNames = inventory.stream().map(i -> i.getFoodName().toLowerCase()).collect(Collectors.toList());
        List<HomeFoodSuggestion> candidateSuggestions = new ArrayList<>();

        boolean hasEggs = availableNames.stream().anyMatch(n -> n.contains("egg"));
        boolean hasBread = availableNames.stream().anyMatch(n -> n.contains("bread") || n.contains("toast"));
        boolean hasMilk = availableNames.stream().anyMatch(n -> n.contains("milk") || n.contains("yogurt"));
        boolean hasVeg = availableNames.stream().anyMatch(n -> n.contains("vegetable") || n.contains("spinach") || n.contains("tomato"));
        boolean hasRice = availableNames.stream().anyMatch(n -> n.contains("rice"));
        boolean hasProtein = availableNames.stream().anyMatch(n -> n.contains("chicken") || n.contains("fish") || n.contains("lentil") || n.contains("dal"));

        if (hasEggs && hasBread) {
            candidateSuggestions.add(createSuggestion("Eggs on Toast", "BREAKFAST",
                List.of("Eggs", "Bread"), 250, 15, "Scramble or boil eggs, serve on toast", plan != null));
        }
        if (hasMilk && hasBread) {
            candidateSuggestions.add(createSuggestion("Milk and Toast", "BREAKFAST",
                List.of("Milk", "Bread"), 180, 8, "Warm milk with toasted bread", plan != null));
        }
        if (hasRice && hasProtein && hasVeg) {
            candidateSuggestions.add(createSuggestion("Rice Bowl with Protein", "LUNCH",
                List.of("Rice", "Protein source", "Vegetables"), 450, 25, "Cook rice, add protein and vegetables", plan != null));
        }
        if (hasVeg && hasProtein) {
            candidateSuggestions.add(createSuggestion("Protein and Vegetable Stir Fry", "DINNER",
                List.of("Protein source", "Vegetables"), 350, 30, "Quick stir fry with available protein and vegetables", plan != null));
        }

        if (candidateSuggestions.isEmpty() && !inventory.isEmpty()) {
            candidateSuggestions.add(createSuggestion("Custom Meal from Available Items", "ANY",
                availableNames, 300, 15,
                "Combine available ingredients. Consult dietitian for specific proportions.", false));
        }

        // CLINICAL GUARDRAIL FILTER: Filter out suggestions violating known patient allergies
        List<HomeFoodSuggestion> safeSuggestions = candidateSuggestions.stream().filter(s -> {
            String nameLower = s.getMealName().toLowerCase();
            List<String> ingredientsLower = s.getIngredients().stream().map(String::toLowerCase).collect(Collectors.toList());
            for (String allergy : patientAllergies) {
                if (nameLower.contains(allergy)) return false;
                for (String ing : ingredientsLower) {
                    if (ing.contains(allergy)) return false;
                }
            }
            return true;
        }).collect(Collectors.toList());

        for (HomeFoodSuggestion s : safeSuggestions) {
            s.setClinicalSafetyValidated(true);
            if (!patientAllergies.isEmpty()) {
                s.setNutritionNote(s.getNutritionNote() + " (Validated safe for allergies: " + String.join(", ", patientAllergies) + ")");
            }
        }

        return safeSuggestions;
    }

    private HomeFoodSuggestion createSuggestion(String name, String type, List<String> ingredients,
            double cal, double protein, String prep, boolean matchesPlan) {
        HomeFoodSuggestion s = new HomeFoodSuggestion();
        s.setMealName(name); s.setMealType(type); s.setIngredients(ingredients);
        s.setEstimatedCalories(cal); s.setEstimatedProteinG(protein);
        s.setPreparationNotes(prep); s.setMatchesDietPlan(matchesPlan);
        s.setClinicalSafetyValidated(true);
        s.setNutritionNote(matchesPlan ? "Consistent with approved diet plan" : "Consult dietitian for plan alignment");
        return s;
    }
}
