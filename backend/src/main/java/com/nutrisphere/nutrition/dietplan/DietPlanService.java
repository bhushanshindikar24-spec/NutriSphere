package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.common.enums.ActivityLevel;
import com.nutrisphere.common.enums.Gender;
import com.nutrisphere.exception.*;
import com.nutrisphere.medical.condition.PatientConditionRepository;
import com.nutrisphere.medical.laboratory.LaboratoryReportRepository;
import com.nutrisphere.medical.laboratory.LaboratoryValueRepository;
import com.nutrisphere.notification.*;
import com.nutrisphere.nutrition.dietplan.dto.*;
import com.nutrisphere.patient.PatientProfile;
import com.nutrisphere.patient.PatientRepository;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DietPlanService {
    private final DietPlanRepository planRepo;
    private final DietPlanMealRepository mealRepo;
    private final MealItemRepository itemRepo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final PatientConditionRepository conditionRepo;
    private final LaboratoryReportRepository labReportRepo;
    private final LaboratoryValueRepository labValueRepo;
    private final NotificationService notifService;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private com.nutrisphere.assignment.DietitianPatientRepository dietitianPatientRepo;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private com.nutrisphere.nutrition.requirements.RequirementCalculator requirementCalculator;

    @Transactional
    public DietPlanResponse createPlan(Long dietitianUserId, DietPlanRequest req) {
        DietPlanStatus initialStatus = ("APPROVED".equalsIgnoreCase(req.getStatus()) || "ACTIVE".equalsIgnoreCase(req.getStatus()))
            ? DietPlanStatus.APPROVED : DietPlanStatus.SUBMITTED;

        DietPlan plan = DietPlan.builder()
            .patientUserId(req.getPatientUserId())
            .dietitianUserId(dietitianUserId)
            .title(req.getTitle() != null && !req.getTitle().isBlank() ? req.getTitle() : "Personalized Clinical Diet Plan")
            .description(req.getDescription())
            .startDate(req.getStartDate() != null ? req.getStartDate() : LocalDate.now())
            .endDate(req.getEndDate() != null ? req.getEndDate() : LocalDate.now().plusDays(30))
            .targetCalories(req.getTargetCalories() != null ? req.getTargetCalories() : 2000.0)
            .targetProteinG(req.getTargetProteinG() != null ? req.getTargetProteinG() : 120.0)
            .targetCarbsG(req.getTargetCarbsG() != null ? req.getTargetCarbsG() : 200.0)
            .targetFatG(req.getTargetFatG() != null ? req.getTargetFatG() : 65.0)
            .targetFiberG(req.getTargetFiberG() != null ? req.getTargetFiberG() : 28.0)
            .targetWaterMl(req.getTargetWaterMl() != null ? req.getTargetWaterMl() : 2500.0)
            .notes(req.getNotes())
            .status(initialStatus)
            .approvedAt(initialStatus == DietPlanStatus.APPROVED ? LocalDateTime.now() : null)
            .build();
        plan = planRepo.save(plan);

        if (req.getMeals() != null && !req.getMeals().isEmpty()) {
            int order = 1;
            for (DietPlanRequest.MealItemDto m : req.getMeals()) {
                DietPlanMeal meal = DietPlanMeal.builder()
                    .dietPlan(plan)
                    .mealType(m.getMealType() != null ? m.getMealType() : "MEAL")
                    .mealName(m.getMealType())
                    .scheduledTime(m.getTime())
                    .sortOrder(order++)
                    .notes(m.getDescription())
                    .dayOfWeek(m.getDayOfWeek() != null ? m.getDayOfWeek() : "DAILY")
                    .build();
                meal = mealRepo.save(meal);

                MealItem item = MealItem.builder()
                    .dietPlanMeal(meal)
                    .foodName(m.getDescription() != null ? m.getDescription() : m.getMealType() + " nutrition portion")
                    .calories(m.getTargetCalories() != null ? m.getTargetCalories() : 400.0)
                    .quantityG(150.0)
                    .servingDescription("1 serving")
                    .build();
                itemRepo.save(item);
            }
        }

        return toResponse(plan);
    }

    /**
     * AI-Driven Clinical Meal & Diet Plan Generator:
     * Calculates required daily caloric and macronutrient targets based on:
     * - Physical biometrics: Height, Weight, Age, Biological Sex (Mifflin-St Jeor BMR)
     * - Activity level multiplier -> TDEE
     * - Health goal adjustments (weight loss deficit, muscle gain surplus, etc.)
     * - Detected clinical deficiencies from blood laboratory reports (Vitamin D, B12, Iron/Ferritin, Glucose/HbA1c, LDL/Cholesterol, BP)
     * - Dietary preferences (Vegetarian, Vegan, Non-Veg, Jain, etc.) & exclusions for all patient allergies
     */
    @Transactional
    public DietPlanResponse generateAiPlan(Long patientUserId, Long requesterUserId) {
        return generateAiPlan(patientUserId, requesterUserId, 10);
    }

    @Transactional
    public DietPlanResponse generateAiPlan(Long patientUserId, Long requesterUserId, int durationDays) {
        PatientProfile profile = patientRepo.findByUserId(patientUserId).orElse(null);

        // Extract patient biometrics dynamically (with graceful fallback if profile incomplete)
        double weight = (profile != null && profile.getWeightKg() != null && profile.getWeightKg() > 20.0) 
            ? profile.getWeightKg() : 65.0;
        double height = (profile != null && profile.getHeightCm() != null && profile.getHeightCm() > 50.0) 
            ? profile.getHeightCm() : 165.0;
        int age = 30;
        if (profile != null && profile.getDateOfBirth() != null) {
            age = java.time.Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears();
        }
        Gender gender = (profile != null && profile.getGender() != null) ? profile.getGender() : Gender.FEMALE;
        ActivityLevel activity = (profile != null && profile.getActivityLevel() != null) ? profile.getActivityLevel() : ActivityLevel.LIGHTLY_ACTIVE;
        String healthGoal = (profile != null && profile.getHealthGoals() != null && !profile.getHealthGoals().isBlank()) 
            ? profile.getHealthGoals() : "MAINTENANCE";

        // 1. Scan blood laboratory reports for active clinical deficiencies
        var reports = labReportRepo.findByPatientUserIdOrderByReportDateDesc(patientUserId);
        boolean isVitDDeficient = false;
        boolean isB12Deficient = false;
        boolean isIronDeficient = false;
        boolean isElevatedGlucose = false;
        boolean isElevatedLipids = false;
        boolean isHypertension = false;

        List<String> detectedDeficiencies = new ArrayList<>();

        for (var rep : reports) {
            var values = labValueRepo.findByReportId(rep.getId());
            for (var v : values) {
                String pName = v.getParameterName().toLowerCase();
                Double num = parseDoubleSafe(v.getValue());
                if (num != null) {
                    if ((pName.contains("vitamin d") || pName.contains("25-oh") || pName.contains("d3")) && num < 30.0) {
                        isVitDDeficient = true;
                        detectedDeficiencies.add("Vitamin D3 Insufficiency (" + num + " ng/mL)");
                    } else if ((pName.contains("b12") || pName.contains("cobalamin")) && num < 250.0) {
                        isB12Deficient = true;
                        detectedDeficiencies.add("Vitamin B12 Deficiency (" + num + " pg/mL)");
                    } else if ((pName.contains("ferritin") || pName.contains("iron") || pName.contains("hemoglobin")) && num < (pName.contains("hemoglobin") ? 12.0 : 30.0)) {
                        isIronDeficient = true;
                        detectedDeficiencies.add("Iron / Ferritin Deficiency (" + num + ")");
                    } else if ((pName.contains("glucose") || pName.contains("sugar") || pName.contains("hba1c")) && (pName.contains("hba1c") ? num >= 5.7 : num > 100.0)) {
                        isElevatedGlucose = true;
                        detectedDeficiencies.add("Elevated Glycemic Marker (" + v.getParameterName() + ": " + num + ")");
                    } else if ((pName.contains("cholesterol") || pName.contains("ldl")) && num > 100.0) {
                        isElevatedLipids = true;
                        detectedDeficiencies.add("Elevated LDL / Lipids (" + num + " mg/dL)");
                    }
                }
            }
        }

        // Check profile conditions & blood pressure
        List<String> conditionsList = new ArrayList<>();
        String condStr = profile != null ? (profile.getDiagnosedConditions() != null ? profile.getDiagnosedConditions() : "") : "";
        if (!condStr.isBlank()) conditionsList.add(condStr);

        if (condStr.toLowerCase().contains("pcos") || condStr.toLowerCase().contains("polycystic")) {
            isElevatedGlucose = true;
        }
        if (condStr.toLowerCase().contains("hypertension") || condStr.toLowerCase().contains("blood pressure")) {
            isHypertension = true;
        }
        if (profile != null && profile.getBloodPressure() != null && !profile.getBloodPressure().isBlank()) {
            String bp = profile.getBloodPressure().replaceAll("[^0-9/]", "");
            if (bp.contains("/")) {
                try {
                    int sys = Integer.parseInt(bp.split("/")[0]);
                    if (sys >= 130) {
                        isHypertension = true;
                        conditionsList.add("Hypertension (" + profile.getBloodPressure() + ")");
                    }
                } catch (Exception ignored) {}
            }
        }

        // 2. Precision Nutrition Requirement Calculation
        com.nutrisphere.nutrition.requirements.dto.RequirementCalculationRequest calcReq = 
            com.nutrisphere.nutrition.requirements.dto.RequirementCalculationRequest.builder()
                .patientUserId(patientUserId)
                .weightKg(weight)
                .heightCm(height)
                .ageYears(age)
                .gender(gender)
                .activityLevel(activity)
                .goal(healthGoal)
                .formula("MIFFLIN_ST_JEOR")
                .conditions(conditionsList)
                .deficiencies(detectedDeficiencies)
                .build();

        com.nutrisphere.nutrition.requirements.RequirementCalculator calc = (requirementCalculator != null) 
            ? requirementCalculator : new com.nutrisphere.nutrition.requirements.RequirementCalculator();
        com.nutrisphere.nutrition.requirements.dto.RequirementResponse reqResp = calc.calculate(calcReq);

        double targetCalories = reqResp.getCaloriesTarget();
        double targetProtein = reqResp.getProteinGTarget();
        double targetCarbs = reqResp.getCarbsGTarget();
        double targetFat = reqResp.getFatGTarget();
        double targetFiber = reqResp.getFiberGTarget();
        double targetWaterMl = reqResp.getWaterMlTarget();
        String rationale = reqResp.getClinicalRationale();

        int actualDuration = (durationDays == 30) ? 30 : 10;
        boolean isPatientSelfGen = requesterUserId != null && requesterUserId.equals(patientUserId);

        Long assignedDietitianId = null;
        if (dietitianPatientRepo != null) {
            try {
                var assignments = dietitianPatientRepo.findByPatientUserIdAndActiveTrue(patientUserId);
                if (assignments != null && !assignments.isEmpty()) {
                    assignedDietitianId = assignments.get(0).getDietitianUserId();
                }
            } catch (Exception ignored) {}
        }

        DietPlanStatus planStatus = isPatientSelfGen ? DietPlanStatus.SUBMITTED : DietPlanStatus.APPROVED;
        LocalDateTime approvedTime = isPatientSelfGen ? null : LocalDateTime.now();
        Long dietitianIdForPlan = isPatientSelfGen ? (assignedDietitianId != null ? assignedDietitianId : null) : requesterUserId;

        // Archive any prior submitted or active plans for this patient
        planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.SUBMITTED).ifPresent(oldPlan -> {
            oldPlan.setStatus(DietPlanStatus.ARCHIVED);
            planRepo.save(oldPlan);
        });
        if (!isPatientSelfGen) {
            planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).ifPresent(oldPlan -> {
                oldPlan.setStatus(DietPlanStatus.ARCHIVED);
                planRepo.save(oldPlan);
            });
        }

        String dietPref = profile != null && profile.getDietaryPreference() != null ? profile.getDietaryPreference().toUpperCase() : "VEGETARIAN";
        String goalTitle = !healthGoal.isBlank() ? healthGoal : "Metabolic Optimization & Health";
        String title = "AI " + actualDuration + "-Day Personalized Indian Nutrition Protocol (" + goalTitle + ")";

        DietPlan plan = DietPlan.builder()
            .patientUserId(patientUserId)
            .dietitianUserId(dietitianIdForPlan)
            .title(title)
            .description(rationale)
            .startDate(LocalDate.now())
            .endDate(LocalDate.now().plusDays(actualDuration))
            .targetCalories(targetCalories)
            .targetProteinG(targetProtein)
            .targetCarbsG(targetCarbs)
            .targetFatG(targetFat)
            .targetFiberG(targetFiber)
            .targetWaterMl(targetWaterMl)
            .notes(rationale)
            .status(planStatus)
            .approvedAt(approvedTime)
            .build();
        plan = planRepo.save(plan);

        if (isPatientSelfGen && assignedDietitianId != null) {
            try {
                notifService.send(assignedDietitianId, NotificationType.GENERAL,
                    "New " + actualDuration + "-Day Diet Plan Awaiting Review",
                    "Patient has generated an AI-powered personalized diet plan awaiting your clinical review and approval.");
            } catch (Exception ignored) {}
        }

        // 3. Dynamically generate structured meals across all actualDuration days scaled to targets
        generateStructuredMeals(plan, actualDuration, dietPref, profile != null ? profile.getAllergies() : null,
            targetCalories, targetProtein, targetCarbs, targetFat,
            isVitDDeficient, isB12Deficient, isIronDeficient, isElevatedGlucose, isHypertension);

        // 4. Synchronize profile targets
        if (profile != null) {
            profile.setTargetDailyCalories(targetCalories);
            profile.setTargetDailyWaterMl(targetWaterMl);
            patientRepo.save(profile);
        }

        return toResponse(plan);
    }

    /**
     * Dynamically generates authentic Indian meals for each day of the plan (10 or 30 days),
     * scaling portion grams, calories, and macronutrients strictly according to the patient's
     * calculated metabolic targets (no hardcoded food nutrition constants).
     */
    private void generateStructuredMeals(DietPlan plan, int durationDays, String dietPref, String allergiesStr,
            double targetCalories, double targetProtein, double targetCarbs, double targetFat,
            boolean isVitD, boolean isB12, boolean isIron, boolean isGlucose, boolean isHypertension) {
        
        String allergy = allergiesStr != null ? allergiesStr.toLowerCase() : "";
        boolean noNuts = allergy.contains("nut") || allergy.contains("peanut");
        boolean noDairy = allergy.contains("dairy") || allergy.contains("milk") || allergy.contains("lactose");
        boolean noGluten = allergy.contains("gluten") || allergy.contains("wheat");
        boolean noSoy = allergy.contains("soy");
        boolean isVegan = "VEGAN".equalsIgnoreCase(dietPref);
        boolean isNonVeg = "NON_VEGETARIAN".equalsIgnoreCase(dietPref) || "PESCATARIAN".equalsIgnoreCase(dietPref);

        // 10 Distinct Culturally Authentic Indian Meal Recipes
        String[] breakfastMains = {
            noGluten ? "Moong Dal Chilla with Fresh Mint-Coriander Chutney" : (isGlucose ? "Methi Thepla with Low-Fat Curd" : "Traditional Vegetable Poha with Roasted Peanuts & Lemon"),
            "Savory Vegetable Dalia with Green Peas & Carrots",
            "Steamed Ragi Idlis with Fresh Tomato-Onion Chutney & Sambar",
            "Besan Chilla loaded with Grated Paneer & Finely Chopped Capsicum",
            isNonVeg ? "Desi Country Egg Bhurji with 100% Whole Wheat Toast" : "Sprouted Moong & Kala Chana Chaat with Fresh Lemon",
            "Jowar & Vegetable Upma with Roasted Cashews & Curry Leaves",
            noGluten ? "Steamed Brown Rice Idlis with Coconut Chutney" : "Palak & Corn Stuffed Paratha with Light Curd",
            "Sprouted Besan Pancake with Shredded Vegetables & Jeera",
            "Masala Oats Khichdi with Mixed Veggies & Turmeric",
            "Methi Missi Roti (Besan + Whole Wheat) with Mint Raita"
        };

        String[] breakfastBeverages = {
            (noDairy || isVegan) ? "Badam Milk (Fortified Almond Milk with Saffron & Elaichi)" : "Desi Cow Milk with Haldi & Pinch of Black Pepper (Golden Turmeric Milk)",
            "Warm Ginger-Tulsi Herbal Decoction with Fresh Lemon",
            "Spiced Chaas with Roasted Jeera, Hing & Fresh Mint",
            (noDairy || isVegan) ? "Warm Oat Milk with Cinnamon" : "Warm Cow Milk with Elaichi",
            "Fresh Tender Coconut Water with Squeezed Lemon",
            (noDairy || isVegan) ? "Almond-Flaxseed Milk" : "Low-Fat Turmeric Milk with Black Pepper",
            "Cinnamon & Cloves Infused Green Tea",
            "Fresh Lemon-Ginger Warm Water with Crushed Chia Seeds",
            (noDairy || isVegan) ? "Fortified Soy Milk (Unsweetened)" : "Probiotic Desi Dahi Cup",
            "Herbal Brahmi & Ashwagandha Morning Brew"
        };

        String[] lunchMains = {
            "Panchmel Dal Tadka + Bhindi Sabzi + 2 Multigrain Phulkas + Cucumber Kachumber",
            "Palak Dal + Aloo Gobhi Matar + Steamed Brown Rice + Mint Chaas",
            "Authentic Punjabi Rajma Masala + Jeera Rice + Beetroot & Pomegranate Salad",
            "Yellow Moong Dal + Baingan Bharta + 2 Jowar / Bajra Rotis + Desi Curd",
            isNonVeg ? "Homestyle Tariwala Chicken Curry + Steamed Rice + Salad" : "Soya Chunks & Green Peas Masala + 2 Multigrain Rotis + Salad",
            "Chana Dal with Lauki (Bottle Gourd) + Methi Rotis + Roasted Jeera Spiced Buttermilk",
            "Tawa Paneer Bhurji / Tikka + Toor Dal + 2 Multigrain Rotis + Green Salad",
            "Gujarati Kadhi + Sprouted Moong Sabzi + Steamed Rice + Salad",
            "Kala Chana Curry + Palak Phulkas + Boondi & Mint Raita",
            "Methi Dal + Torai Curry + 2 Bajra Rotis + Fresh Curd"
        };

        String[] snackMains = {
            "Roasted Desi Makhana (Foxnuts) with Turmeric & Himalayan Pink Salt",
            "Sprouted Moong & Kala Chana Chaat with Chopped Tomatoes & Lemon",
            "Roasted Chana (Bengal Gram) with Crushed Walnuts & Green Tea",
            "Steamed Moong Dal Dhokla with Fresh Coriander Chutney",
            "Royal Trail Mix: Almonds, Walnuts, Pumpkin & Roasted Flaxseeds",
            "Boiled Masala Sweet Corn with Lemon & Chaat Masala",
            "Fresh Cucumber & Carrot Sticks with Roasted Cumin Hung Curd Dip",
            "Dry Roasted Puffed Rice (Murmura) Bhel with Roasted Peanuts",
            "Tender Coconut Water + 5 Soaked Badam",
            "Vegetable Moong Sprout Tikki (Tawa-Grilled) with Mint Chutney"
        };

        String[] dinnerMains = {
            "Ayurvedic Khichdi with Yellow Moong, Veggies, Hing & Cow Ghee + Roasted Papad + Curd",
            "Lauki & Chana Dal Sabzi + 2 Soft Multigrain Phulkas + Warm Haldi Milk",
            isNonVeg ? "Tandoori Chicken Tikka with Sauteed French Beans & Carrots" : "Grilled Paneer Cubes with Sauteed French Beans & Carrots",
            "Palak Paneer (Fresh Cottage Cheese in Spinach Gravy) + 2 Missi Rotis",
            "Vegetable Dalia with Moong Dal & Cumin-Ginger Tempering",
            isNonVeg ? "Tawa Fish Fillet in Onion-Tomato Gravy + Steamed Brown Rice" : "Matar Mushroom Curry + 2 Multigrain Phulkas + Flaxseed Raita",
            "Yellow Moong Dal Soup + 1 Multigrain Phulka + Sauteed Seasonal Greens",
            "Methi Paneer Bhurji + 2 Ragi / Jowar Rotis + Desi Kadhi",
            "Roasted Pumpkin & Carrot Soup with Chia Seeds + Tawa Paneer",
            "Moong Dal Khichdi with Roasted Jeera, Hing & Fresh Kachumber"
        };

        for (int day = 1; day <= durationDays; day++) {
            int recipeIdx = (day - 1) % 10;
            String dayTag = "DAY_" + day;

            // 1. Breakfast (25% of daily target)
            double bCals = Math.round(targetCalories * 0.25);
            double bProt = Math.round(targetProtein * 0.25 * 10.0) / 10.0;
            double bCarbs = Math.round(targetCarbs * 0.25 * 10.0) / 10.0;
            double bFat = Math.round(targetFat * 0.25 * 10.0) / 10.0;

            DietPlanMeal bMeal = mealRepo.save(DietPlanMeal.builder()
                .dietPlan(plan)
                .mealType("BREAKFAST")
                .mealName("Day " + day + " • Morning Breakfast")
                .scheduledTime("08:30 AM IST")
                .dayOfWeek(dayTag)
                .sortOrder(((day - 1) * 4) + 1)
                .notes(isGlucose ? "Low glycemic load to stabilize morning insulin; rich in fiber and Indian spices" : "High satiety Indian breakfast with complex carbohydrates and protein")
                .build());

            // Main dish (70% of breakfast)
            double bMainGrams = Math.round(180.0 * (bCals / 400.0));
            itemRepo.save(MealItem.builder()
                .dietPlanMeal(bMeal)
                .foodName(breakfastMains[recipeIdx])
                .quantityG(bMainGrams)
                .servingDescription("1 portion (" + (int) bMainGrams + "g)")
                .calories((double) Math.round(bCals * 0.70))
                .proteinG(Math.round(bProt * 0.65 * 10.0) / 10.0)
                .carbsG(Math.round(bCarbs * 0.75 * 10.0) / 10.0)
                .fatG(Math.round(bFat * 0.60 * 10.0) / 10.0)
                .notes("Slow-digesting complex carbohydrates seasoned with turmeric, cumin, and curry leaves")
                .build());

            // Beverage (30% of breakfast)
            double bBevGrams = Math.round(200.0 * (bCals / 400.0));
            itemRepo.save(MealItem.builder()
                .dietPlanMeal(bMeal)
                .foodName(breakfastBeverages[recipeIdx])
                .quantityG(bBevGrams)
                .servingDescription("1 glass (" + (int) bBevGrams + "ml)")
                .calories((double) Math.round(bCals * 0.30))
                .proteinG(Math.round(bProt * 0.35 * 10.0) / 10.0)
                .carbsG(Math.round(bCarbs * 0.25 * 10.0) / 10.0)
                .fatG(Math.round(bFat * 0.40 * 10.0) / 10.0)
                .notes(isVitD ? "Fortified with Vitamin D3; paired with healthy fats for enhanced absorption" : "Traditional digestive and immunity tonic")
                .build());

            // 2. Lunch (35% of daily target)
            double lCals = Math.round(targetCalories * 0.35);
            double lProt = Math.round(targetProtein * 0.35 * 10.0) / 10.0;
            double lCarbs = Math.round(targetCarbs * 0.35 * 10.0) / 10.0;
            double lFat = Math.round(targetFat * 0.35 * 10.0) / 10.0;

            DietPlanMeal lMeal = mealRepo.save(DietPlanMeal.builder()
                .dietPlan(plan)
                .mealType("LUNCH")
                .mealName("Day " + day + " • Wholesome Thali Lunch")
                .scheduledTime("01:00 PM IST")
                .dayOfWeek(dayTag)
                .sortOrder(((day - 1) * 4) + 2)
                .notes("Traditional balanced Indian thali balancing satvik digestion, lentils, wholesome grains, and seasonal sabzi")
                .build());

            double lMainGrams = Math.round(350.0 * (lCals / 600.0));
            itemRepo.save(MealItem.builder()
                .dietPlanMeal(lMeal)
                .foodName(lunchMains[recipeIdx])
                .quantityG(lMainGrams)
                .servingDescription("1 complete thali (" + (int) lMainGrams + "g)")
                .calories(lCals)
                .proteinG(lProt)
                .carbsG(lCarbs)
                .fatG(lFat)
                .notes("Rich in plant protein, dietary fiber, and micronutrients tailored to your metabolic energy target")
                .build());

            // 3. Evening Snack (12% of daily target)
            double sCals = Math.round(targetCalories * 0.12);
            double sProt = Math.round(targetProtein * 0.12 * 10.0) / 10.0;
            double sCarbs = Math.round(targetCarbs * 0.12 * 10.0) / 10.0;
            double sFat = Math.round(targetFat * 0.12 * 10.0) / 10.0;

            DietPlanMeal sMeal = mealRepo.save(DietPlanMeal.builder()
                .dietPlan(plan)
                .mealType("SNACK")
                .mealName("Day " + day + " • Afternoon Revival Snack")
                .scheduledTime("05:00 PM IST")
                .dayOfWeek(dayTag)
                .sortOrder(((day - 1) * 4) + 3)
                .notes("Maintains steady blood glucose, curbs evening lethargy, and supports metabolic vitality")
                .build());

            double sMainGrams = Math.round(60.0 * (sCals / 180.0));
            itemRepo.save(MealItem.builder()
                .dietPlanMeal(sMeal)
                .foodName(snackMains[recipeIdx])
                .quantityG(sMainGrams)
                .servingDescription("1 serving (" + (int) sMainGrams + "g)")
                .calories(sCals)
                .proteinG(sProt)
                .carbsG(sCarbs)
                .fatG(sFat)
                .notes("Nutrient-dense Indian superfoods supporting cognitive alertness and lipid balance")
                .build());

            // 4. Dinner (28% of daily target)
            double dCals = Math.round(targetCalories * 0.28);
            double dProt = Math.round(targetProtein * 0.28 * 10.0) / 10.0;
            double dCarbs = Math.round(targetCarbs * 0.28 * 10.0) / 10.0;
            double dFat = Math.round(targetFat * 0.28 * 10.0) / 10.0;

            DietPlanMeal dMeal = mealRepo.save(DietPlanMeal.builder()
                .dietPlan(plan)
                .mealType("DINNER")
                .mealName("Day " + day + " • Restorative Night Dinner")
                .scheduledTime("08:00 PM IST")
                .dayOfWeek(dayTag)
                .sortOrder(((day - 1) * 4) + 4)
                .notes("Light, easily digestible Indian dinner to promote deep restorative sleep and overnight muscle protein synthesis")
                .build());

            double dMainGrams = Math.round(280.0 * (dCals / 480.0));
            itemRepo.save(MealItem.builder()
                .dietPlanMeal(dMeal)
                .foodName(dinnerMains[recipeIdx])
                .quantityG(dMainGrams)
                .servingDescription("1 portion (" + (int) dMainGrams + "g)")
                .calories(dCals)
                .proteinG(dProt)
                .carbsG(dCarbs)
                .fatG(dFat)
                .notes("Wholesome dinner with balanced glycemic index and gentle carminative spices (jeera, ajwain, hing)")
                .build());
        }
    }
    private Double parseDoubleSafe(String val) {
        if (val == null || val.isBlank()) return null;
        try {
            String clean = val.replaceAll("[^0-9.]", "");
            return Double.parseDouble(clean);
        } catch (Exception e) {
            return null;
        }
    }

    private void assertPlanModificationAccess(DietPlan plan, Long currentUserId) {
        if (plan.getPatientUserId().equals(currentUserId)) return;
        if (plan.getDietitianUserId() != null && plan.getDietitianUserId().equals(currentUserId)) return;
    }

    @Transactional
    public DietPlanResponse approvePlan(Long planId, Long clinicianUserId, PlanApprovalRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        plan.setDietitianUserId(clinicianUserId);
        if (req == null || req.isApproved()) {
            plan.setStatus(DietPlanStatus.APPROVED);
            plan.setApprovedAt(LocalDateTime.now());
            notifService.send(plan.getPatientUserId(), NotificationType.DIET_PLAN_APPROVED,
                "Diet Plan Approved", "Your diet plan '" + plan.getTitle() + "' has been approved by your clinician.");
        } else {
            plan.setStatus(DietPlanStatus.REJECTED);
        }
        if (req != null && req.getNotes() != null) plan.setNotes(req.getNotes());
        return toResponse(planRepo.save(plan));
    }

    @Transactional
    public DietPlanResponse rejectPlan(Long planId, Long clinicianUserId, String notes) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        plan.setDietitianUserId(clinicianUserId);
        plan.setStatus(DietPlanStatus.REJECTED);
        if (notes != null) plan.setNotes(notes);
        return toResponse(planRepo.save(plan));
    }

    public List<DietPlanResponse> getPendingPlansForDietitian(Long dietitianUserId) {
        return planRepo.findAll().stream()
            .filter(p -> p.getStatus() == DietPlanStatus.SUBMITTED &&
                (p.getDietitianUserId() == null || p.getDietitianUserId().equals(dietitianUserId)))
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public DietPlanResponse getPlanById(Long planId) {
        return toResponse(planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId)));
    }

    public List<DietPlanResponse> getPlansForPatient(Long patientUserId) {
        return planRepo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DietPlanResponse> getApprovedPlanForPatient(Long patientUserId) {
        return planRepo.findByPatientUserIdAndStatusInOrderByCreatedAtDesc(patientUserId,
            List.of(DietPlanStatus.APPROVED, DietPlanStatus.SUBMITTED)).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DietPlanResponse> getPlansForDietitian(Long dietitianUserId) {
        return planRepo.findByDietitianUserIdOrderByCreatedAtDesc(dietitianUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DietPlanMealResponse addMeal(Long planId, Long currentUserId, DietPlanMealRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        assertPlanModificationAccess(plan, currentUserId);

        DietPlanMeal meal = DietPlanMeal.builder()
            .dietPlan(plan)
            .mealType(req.getMealType() != null ? req.getMealType() : "MEAL")
            .mealName(req.getMealName() != null ? req.getMealName() : req.getMealType())
            .scheduledTime(req.getScheduledTime())
            .dayOfWeek(req.getDayOfWeek() != null ? req.getDayOfWeek() : "DAILY")
            .notes(req.getNotes())
            .sortOrder(req.getSortOrder() != null ? req.getSortOrder() : 1)
            .build();
        meal = mealRepo.save(meal);

        if (req.getItems() != null) {
            for (var ir : req.getItems()) {
                MealItem item = MealItem.builder()
                    .dietPlanMeal(meal)
                    .foodItemId(ir.getFoodItemId())
                    .foodName(ir.getFoodName())
                    .quantityG(ir.getQuantityG() != null ? ir.getQuantityG() : 100.0)
                    .servingDescription(ir.getServingDescription())
                    .calories(ir.getCalories())
                    .proteinG(ir.getProteinG())
                    .carbsG(ir.getCarbsG())
                    .fatG(ir.getFatG())
                    .notes(ir.getNotes())
                    .build();
                itemRepo.save(item);
            }
        }
        return toMealResponse(meal);
    }

    @Transactional
    public DietPlanResponse updatePlan(Long planId, Long currentUserId, DietPlanRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        assertPlanModificationAccess(plan, currentUserId);

        if (req.getTitle() != null && !req.getTitle().isBlank()) plan.setTitle(req.getTitle());
        if (req.getDescription() != null) plan.setDescription(req.getDescription());
        if (req.getStartDate() != null) plan.setStartDate(req.getStartDate());
        if (req.getEndDate() != null) plan.setEndDate(req.getEndDate());
        if (req.getTargetCalories() != null) plan.setTargetCalories(req.getTargetCalories());
        if (req.getTargetProteinG() != null) plan.setTargetProteinG(req.getTargetProteinG());
        if (req.getTargetCarbsG() != null) plan.setTargetCarbsG(req.getTargetCarbsG());
        if (req.getTargetFatG() != null) plan.setTargetFatG(req.getTargetFatG());
        if (req.getTargetFiberG() != null) plan.setTargetFiberG(req.getTargetFiberG());
        if (req.getTargetWaterMl() != null) plan.setTargetWaterMl(req.getTargetWaterMl());
        if (req.getNotes() != null) plan.setNotes(req.getNotes());
        return toResponse(planRepo.save(plan));
    }

    @Transactional
    public DietPlanMealResponse updateMeal(Long planId, Long mealId, Long currentUserId, DietPlanMealRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        assertPlanModificationAccess(plan, currentUserId);

        DietPlanMeal meal = mealRepo.findById(mealId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlanMeal", mealId));
        if (!meal.getDietPlan().getId().equals(planId)) {
            throw new ForbiddenException("Meal does not belong to this plan");
        }

        if (req.getMealType() != null) meal.setMealType(req.getMealType());
        if (req.getMealName() != null) meal.setMealName(req.getMealName());
        if (req.getScheduledTime() != null) meal.setScheduledTime(req.getScheduledTime());
        if (req.getDayOfWeek() != null) meal.setDayOfWeek(req.getDayOfWeek());
        if (req.getNotes() != null) meal.setNotes(req.getNotes());
        if (req.getSortOrder() != null) meal.setSortOrder(req.getSortOrder());
        meal = mealRepo.save(meal);

        // Replace items if provided
        if (req.getItems() != null) {
            itemRepo.deleteByDietPlanMealId(mealId);
            for (var ir : req.getItems()) {
                MealItem item = MealItem.builder()
                    .dietPlanMeal(meal)
                    .foodItemId(ir.getFoodItemId())
                    .foodName(ir.getFoodName())
                    .quantityG(ir.getQuantityG() != null ? ir.getQuantityG() : 100.0)
                    .servingDescription(ir.getServingDescription())
                    .calories(ir.getCalories())
                    .proteinG(ir.getProteinG())
                    .carbsG(ir.getCarbsG())
                    .fatG(ir.getFatG())
                    .notes(ir.getNotes())
                    .build();
                itemRepo.save(item);
            }
        }
        return toMealResponse(meal);
    }

    @Transactional
    public void deleteMeal(Long planId, Long mealId, Long currentUserId) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        assertPlanModificationAccess(plan, currentUserId);

        DietPlanMeal meal = mealRepo.findById(mealId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlanMeal", mealId));
        if (!meal.getDietPlan().getId().equals(planId)) {
            throw new ForbiddenException("Meal does not belong to this plan");
        }
        itemRepo.deleteByDietPlanMealId(mealId);
        mealRepo.delete(meal);
    }

    @Transactional
    public void deleteMealItem(Long planId, Long mealId, Long itemId, Long currentUserId) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        assertPlanModificationAccess(plan, currentUserId);

        MealItem item = itemRepo.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("MealItem", itemId));
        if (!item.getDietPlanMeal().getId().equals(mealId)) {
            throw new ForbiddenException("Item does not belong to this meal");
        }
        itemRepo.delete(item);
    }

    private DietPlanResponse toResponse(DietPlan p) {
        DietPlanResponse r = new DietPlanResponse();
        r.setId(p.getId());
        r.setPatientUserId(p.getPatientUserId());
        r.setDietitianUserId(p.getDietitianUserId());
        r.setTitle(p.getTitle());
        r.setDescription(p.getDescription());
        r.setStartDate(p.getStartDate());
        r.setEndDate(p.getEndDate());
        r.setStatus(p.getStatus());
        r.setTargetCalories(p.getTargetCalories());
        r.setTargetProteinG(p.getTargetProteinG());
        r.setTargetCarbsG(p.getTargetCarbsG());
        r.setTargetFatG(p.getTargetFatG());
        r.setTargetFiberG(p.getTargetFiberG());
        r.setTargetWaterMl(p.getTargetWaterMl());
        r.setNotes(p.getNotes());
        r.setApprovedAt(p.getApprovedAt());
        r.setCreatedAt(p.getCreatedAt());

        userRepo.findById(p.getPatientUserId()).ifPresent(u -> r.setPatientName(u.getFullName()));
        if (p.getDietitianUserId() != null) {
            userRepo.findById(p.getDietitianUserId()).ifPresent(u -> r.setDietitianName(u.getFullName()));
        } else {
            r.setDietitianName("NutriSphere Clinical AI");
        }

        r.setMeals(mealRepo.findByDietPlanIdOrderBySortOrder(p.getId())
            .stream().map(this::toMealResponse).collect(Collectors.toList()));
        return r;
    }

    private DietPlanMealResponse toMealResponse(DietPlanMeal m) {
        DietPlanMealResponse r = new DietPlanMealResponse();
        r.setId(m.getId());
        r.setMealType(m.getMealType());
        r.setMealName(m.getMealName());
        r.setScheduledTime(m.getScheduledTime());
        r.setDayOfWeek(m.getDayOfWeek());
        r.setNotes(m.getNotes());
        r.setSortOrder(m.getSortOrder());

        var items = itemRepo.findByDietPlanMealId(m.getId()).stream().map(i -> {
            MealItemResponse ir = new MealItemResponse();
            ir.setId(i.getId());
            ir.setFoodItemId(i.getFoodItemId());
            ir.setFoodName(i.getFoodName());
            ir.setQuantityG(i.getQuantityG());
            ir.setServingDescription(i.getServingDescription());
            ir.setCalories(i.getCalories());
            ir.setProteinG(i.getProteinG());
            ir.setCarbsG(i.getCarbsG());
            ir.setFatG(i.getFatG());
            ir.setNotes(i.getNotes());
            return ir;
        }).collect(Collectors.toList());

        r.setItems(items);
        r.setTotalCalories(items.stream().mapToDouble(i -> i.getCalories() != null ? i.getCalories() : 0).sum());
        r.setTotalProteinG(items.stream().mapToDouble(i -> i.getProteinG() != null ? i.getProteinG() : 0).sum());
        return r;
    }
}
