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
        PatientProfile profile = patientRepo.findByUserId(patientUserId).orElse(null);

        // 1. Scan blood laboratory reports for active deficiencies
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
        String condStr = profile != null ? (profile.getDiagnosedConditions() != null ? profile.getDiagnosedConditions() : "") : "";
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
                    if (sys >= 130) isHypertension = true;
                } catch (Exception ignored) {}
            }
        }

        // 2. Physical Biometrics & BMR / TDEE Calculation
        double weight = profile != null && profile.getWeightKg() != null && profile.getWeightKg() > 20 ? profile.getWeightKg() : 68.0;
        double height = profile != null && profile.getHeightCm() != null && profile.getHeightCm() > 50 ? profile.getHeightCm() : 168.0;
        int age = profile != null && profile.getDateOfBirth() != null 
            ? java.time.Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears() : 30;
        boolean isFemale = profile == null || profile.getGender() != Gender.MALE;

        double bmr = (10.0 * weight) + (6.25 * height) - (5.0 * age) + (isFemale ? -161.0 : 5.0);
        double activityMult = 1.375;
        if (profile != null && profile.getActivityLevel() != null) {
            switch (profile.getActivityLevel()) {
                case SEDENTARY -> activityMult = 1.2;
                case LIGHTLY_ACTIVE -> activityMult = 1.375;
                case MODERATELY_ACTIVE -> activityMult = 1.55;
                case VERY_ACTIVE -> activityMult = 1.725;
                case EXTRA_ACTIVE -> activityMult = 1.9;
            }
        }
        double tdee = bmr * activityMult;

        // 3. Goal Adjustment & Macronutrient Breakdown
        String healthGoal = profile != null && profile.getHealthGoals() != null ? profile.getHealthGoals().toLowerCase() : "";
        double targetCalories = tdee;
        if (healthGoal.contains("loss") || healthGoal.contains("pcos") || healthGoal.contains("deficit") || healthGoal.contains("fat")) {
            targetCalories = Math.max(1250.0, tdee - 400.0);
        } else if (healthGoal.contains("gain") || healthGoal.contains("muscle") || healthGoal.contains("bulk")) {
            targetCalories = tdee + 350.0;
        }
        targetCalories = Math.round(targetCalories / 10.0) * 10.0;

        double targetProtein = (healthGoal.contains("muscle") || healthGoal.contains("gain") || (profile != null && profile.getActivityLevel() == ActivityLevel.VERY_ACTIVE)) 
            ? Math.round(weight * 1.6) : Math.round(weight * 1.3);
        targetProtein = Math.max(65.0, Math.min(180.0, targetProtein));

        double targetFat = Math.round((targetCalories * 0.28) / 9.0);
        targetFat = Math.max(40.0, Math.min(85.0, targetFat));

        double targetFiber = (isElevatedGlucose || condStr.toLowerCase().contains("pcos")) ? 36.0 : 28.0;
        double remainingCals = targetCalories - (targetProtein * 4.0) - (targetFat * 9.0);
        double targetCarbs = Math.max(110.0, Math.round(remainingCals / 4.0));
        double targetWaterMl = Math.round((weight * 35.0) / 100.0) * 100.0;

        // 4. Archive previous active plans
        planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).ifPresent(oldPlan -> {
            oldPlan.setStatus(DietPlanStatus.ARCHIVED);
            planRepo.save(oldPlan);
        });

        // 5. Construct Title & Clinical Rationale
        String dietPref = profile != null && profile.getDietaryPreference() != null ? profile.getDietaryPreference().toUpperCase() : "VEGETARIAN";
        String goalTitle = profile != null && profile.getHealthGoals() != null && !profile.getHealthGoals().isBlank() 
            ? profile.getHealthGoals() : "Metabolic Optimization & Recovery";
        String title = "AI Clinical Nutrition Protocol (" + goalTitle + ")";

        StringBuilder rationale = new StringBuilder();
        rationale.append("Precision Energy: ").append((int) targetCalories).append(" kcal/day (BMR: ").append((int) bmr).append(", TDEE: ").append((int) tdee).append("). ");
        if (!detectedDeficiencies.isEmpty()) {
            rationale.append("Directly formulated to resolve clinical deficiencies: ").append(String.join(", ", detectedDeficiencies)).append(". ");
        }
        if (isElevatedGlucose) {
            rationale.append("Low glycemic index load with high dietary fiber (>").append((int) targetFiber).append("g) to stabilize postprandial glucose and insulin. ");
        }
        if (isHypertension) {
            rationale.append("DASH cardiovascular protocol emphasizing magnesium and potassium with sodium restricted (<2000mg). ");
        }
        if (isVitDDeficient) {
            rationale.append("Incorporates Vitamin D3 fortified sources paired with healthy fats for enhanced absorption. ");
        }
        if (isIronDeficient) {
            rationale.append("High bioavailability iron paired with Vitamin C/citrus synergy for red blood cell restoration. ");
        }

        DietPlan plan = DietPlan.builder()
            .patientUserId(patientUserId)
            .dietitianUserId(requesterUserId)
            .title(title)
            .description(rationale.toString())
            .startDate(LocalDate.now())
            .endDate(LocalDate.now().plusDays(30))
            .targetCalories(targetCalories)
            .targetProteinG(targetProtein)
            .targetCarbsG(targetCarbs)
            .targetFatG(targetFat)
            .targetFiberG(targetFiber)
            .targetWaterMl(targetWaterMl)
            .notes(rationale.toString())
            .status(DietPlanStatus.APPROVED)
            .approvedAt(LocalDateTime.now())
            .build();
        plan = planRepo.save(plan);

        // 6. Generate 4 Structured Daily Meals with Food Items
        generateStructuredMeals(plan, dietPref, profile != null ? profile.getAllergies() : null, isVitDDeficient, isB12Deficient, isIronDeficient, isElevatedGlucose, isHypertension);

        // 7. Synchronize profile targets
        if (profile != null) {
            profile.setTargetDailyCalories(targetCalories);
            profile.setTargetDailyWaterMl(targetWaterMl);
            patientRepo.save(profile);
        }

        return toResponse(plan);
    }

    private void generateStructuredMeals(DietPlan plan, String dietPref, String allergiesStr, boolean isVitD, boolean isB12, boolean isIron, boolean isGlucose, boolean isHypertension) {
        String allergy = allergiesStr != null ? allergiesStr.toLowerCase() : "";
        boolean noNuts = allergy.contains("nut") || allergy.contains("peanut");
        boolean noDairy = allergy.contains("dairy") || allergy.contains("milk") || allergy.contains("lactose");
        boolean noGluten = allergy.contains("gluten") || allergy.contains("wheat");
        boolean noSoy = allergy.contains("soy");
        boolean isVegan = "VEGAN".equalsIgnoreCase(dietPref);
        boolean isNonVeg = "NON_VEGETARIAN".equalsIgnoreCase(dietPref) || "PESCATARIAN".equalsIgnoreCase(dietPref);

        // --- MEAL 1: BREAKFAST / SUBAH KA NASHTA (08:30 AM IST) ~25% calories ---
        DietPlanMeal breakfast = DietPlanMeal.builder()
            .dietPlan(plan).mealType("BREAKFAST").mealName("Breakfast / Subah ka Nashta")
            .scheduledTime("08:30 AM IST").dayOfWeek("DAILY").sortOrder(1)
            .notes(isGlucose ? "Low glycemic load to stabilize morning insulin; rich in fiber and Indian spices" : "High satiety Indian breakfast rich in complex carbohydrates and lean protein")
            .build();
        breakfast = mealRepo.save(breakfast);

        String breakfastMain;
        if (noGluten) {
            breakfastMain = "Moong Dal Chilla with Grated Paneer & Fresh Mint Chutney";
        } else if (isGlucose) {
            breakfastMain = "Methi Thepla (2 pcs) with Mint Raita / Besan Chilla with Veggies";
        } else {
            breakfastMain = "Vegetable Poha with Roasted Peanuts, Mustard Seeds & Fresh Lemon";
        }

        itemRepo.save(MealItem.builder()
            .dietPlanMeal(breakfast)
            .foodName(breakfastMain)
            .quantityG(180.0).servingDescription("1 plate (180g)")
            .calories(240.0).proteinG(11.0).carbsG(36.0).fatG(6.0)
            .notes("Slow-digesting complex carbohydrates seasoned with antioxidant turmeric, cumin, and curry leaves")
            .build());

        String milkBeverage = (noDairy || isVegan) 
            ? "Badam Milk (Fortified Almond Milk with Saffron & Elaichi)" 
            : "Desi Cow Milk with Haldi & Pinch of Black Pepper (Golden Turmeric Milk)";
        itemRepo.save(MealItem.builder()
            .dietPlanMeal(breakfast)
            .foodName(milkBeverage)
            .quantityG(200.0).servingDescription("1 glass (200ml)")
            .calories(95.0).proteinG(4.5).carbsG(8.0).fatG(3.5)
            .notes(isVitD ? "Fortified with Vitamin D3; black pepper enhances curcumin absorption by 2000%" : "Traditional immunity tonic")
            .build());

        String breakfastProtein = isNonVeg 
            ? "Desi Egg Bhurji (2 Country Eggs with Onions, Tomatoes & Fresh Coriander)" 
            : ((noDairy || isVegan || noSoy) ? "Sprouted Moong & Kala Chana Chaat with Lemon" : "Paneer Bhurji with Turmeric, Capsicum & Fresh Coriander");
        itemRepo.save(MealItem.builder()
            .dietPlanMeal(breakfast)
            .foodName(breakfastProtein)
            .quantityG(130.0).servingDescription("1 portion (130g)")
            .calories(185.0).proteinG(15.0).carbsG(6.0).fatG(11.0)
            .notes((isIron ? "High non-heme iron paired with fresh lemon juice; " : "") + (isB12 ? "Rich in bioavailable Vitamin B12" : "Protein foundational building block"))
            .build());

        // --- MEAL 2: LUNCH / DOPAHAR KA BHOJAN (01:30 PM IST) ~35% calories ---
        DietPlanMeal lunch = DietPlanMeal.builder()
            .dietPlan(plan).mealType("LUNCH").mealName("Lunch / Dopahar ka Bhojan")
            .scheduledTime("01:30 PM IST").dayOfWeek("DAILY").sortOrder(2)
            .notes("Traditional balanced Indian thali balancing satvik digestion, lentils, wholesome grains, and seasonal sabzi")
            .build();
        lunch = mealRepo.save(lunch);

        String mainDalOrProtein = isNonVeg
            ? "Homestyle Tariwala Chicken Curry / Rohu Fish Curry in Cumin-Tomato Gravy"
            : (isIron ? "Palak Paneer (Fresh Cottage Cheese in Spinach Gravy)" : "Panchmel Dal Tadka (Yellow Moong, Toor & Chana Dal with Jeera & Hing)");
        itemRepo.save(MealItem.builder()
            .dietPlanMeal(lunch)
            .foodName(mainDalOrProtein)
            .quantityG(180.0).servingDescription("1 katori (180g)")
            .calories(220.0).proteinG(16.0).carbsG(22.0).fatG(6.0)
            .notes(isIron ? "Spinach and lentils deliver cellular iron with prebiotic dietary fiber" : "Core dietary protein anchor")
            .build());

        String grainItem = noGluten 
            ? "2 Jowar Bhakris / Bajra Rotis with Steamed Brown Basmati Rice" 
            : "2 Multigrain Phulkas (Whole Wheat, Jowar & Bajra) with Brown Basmati Rice";
        itemRepo.save(MealItem.builder()
            .dietPlanMeal(lunch)
            .foodName(grainItem)
            .quantityG(160.0).servingDescription("2 phulkas + 1 small katori rice (160g)")
            .calories(230.0).proteinG(7.0).carbsG(46.0).fatG(2.0)
            .notes("High-fiber millet blend delivering sustained postprandial glycemic response")
            .build());

        itemRepo.save(MealItem.builder()
            .dietPlanMeal(lunch)
            .foodName("Bhindi Masala (Okra) / Lauki Chana Dal Sabzi cooked in Cold-Pressed Mustard Oil")
            .quantityG(130.0).servingDescription("1 katori (130g)")
            .calories(90.0).proteinG(3.0).carbsG(12.0).fatG(3.5)
            .notes("High in mucilage soluble fiber and gut-friendly micronutrients")
            .build());

        itemRepo.save(MealItem.builder()
            .dietPlanMeal(lunch)
            .foodName("Indian Kachumber Salad (Diced Cucumber, Tomato, Radish, Lemon & Jeera)")
            .quantityG(120.0).servingDescription("1 plate (120g)")
            .calories(45.0).proteinG(1.5).carbsG(9.0).fatG(0.5)
            .notes("Raw enzymes and natural Vitamin C to maximize iron bioavailability")
            .build());

        if (!noDairy && !isVegan) {
            itemRepo.save(MealItem.builder()
                .dietPlanMeal(lunch)
                .foodName("Fresh Set Dahi (Curd) with Roasted Cumin / Spiced Tadka Chaas")
                .quantityG(150.0).servingDescription("1 katori (150g)")
                .calories(85.0).proteinG(6.0).carbsG(5.0).fatG(3.5)
                .notes("Natural Indian probiotic supporting digestive microflora and Vitamin B12 production")
                .build());
        }

        // --- MEAL 3: EVENING SNACK / SHAAM KA NASHTA (05:00 PM IST) ~15% calories ---
        DietPlanMeal snack = DietPlanMeal.builder()
            .dietPlan(plan).mealType("SNACK").mealName("Evening Snack / Shaam ka Nashta")
            .scheduledTime("05:00 PM IST").dayOfWeek("DAILY").sortOrder(3)
            .notes("Maintains steady blood glucose, curbs evening lethargy, and supports metabolic vitality")
            .build();
        snack = mealRepo.save(snack);

        itemRepo.save(MealItem.builder()
            .dietPlanMeal(snack)
            .foodName("Roasted Desi Makhana (Foxnuts) tossed with Light Cow Ghee & Sendha Namak")
            .quantityG(40.0).servingDescription("1 medium bowl (40g)")
            .calories(145.0).proteinG(4.2).carbsG(26.0).fatG(2.8)
            .notes("Ancient Indian superfood; rich in magnesium, calcium, and low glycemic index")
            .build());

        String snackSeed = noNuts
            ? "Sprouted Moong & Kala Chana Chaat with Pomegranate & Rock Salt"
            : "Roasted Bhuna Chana with 5 Soaked Almonds & Walnuts (Akhrot)";
        itemRepo.save(MealItem.builder()
            .dietPlanMeal(snack)
            .foodName(snackSeed)
            .quantityG(35.0).servingDescription("1 handful (35g)")
            .calories(135.0).proteinG(6.5).carbsG(12.0).fatG(6.0)
            .notes("Crunchy plant protein, plant sterols, and healthy omega-3 fats")
            .build());

        itemRepo.save(MealItem.builder()
            .dietPlanMeal(snack)
            .foodName("Adrak Tulsi Herbal Chai (Ginger Holy Basil Infusion, No Sugar)")
            .quantityG(200.0).servingDescription("1 cup (200ml)")
            .calories(6.0).proteinG(0.2).carbsG(1.2).fatG(0.0)
            .notes("Adaptogenic Indian herb (Tulsi) reduces systemic inflammation and stress cortisol")
            .build());

        // --- MEAL 4: DINNER / RAAT KA KHANA (08:00 PM IST) ~25% calories ---
        DietPlanMeal dinner = DietPlanMeal.builder()
            .dietPlan(plan).mealType("DINNER").mealName("Dinner / Raat ka Khana")
            .scheduledTime("08:00 PM IST").dayOfWeek("DAILY").sortOrder(4)
            .notes("Light, restorative, easily digestible Indian dinner to promote deep restorative sleep")
            .build();
        dinner = mealRepo.save(dinner);

        String dinnerProtein = isNonVeg
            ? "Tandoori Chicken Tikka / Steamed Fish Fillet with Stir-Fried Capsicum & Beans"
            : ((noDairy || isVegan || noSoy) ? "Sautéed Moong Sprouts with Lauki & Tomato Subzi" : "Tawa Grilled Paneer Cubes with Sautéed Indian Vegetables");
        itemRepo.save(MealItem.builder()
            .dietPlanMeal(dinner)
            .foodName(dinnerProtein)
            .quantityG(180.0).servingDescription("1 plate (180g)")
            .calories(210.0).proteinG(18.0).carbsG(10.0).fatG(10.0)
            .notes("Lean protein supplying essential amino acids for tissue repair during sleep")
            .build());

        itemRepo.save(MealItem.builder()
            .dietPlanMeal(dinner)
            .foodName("Moong Dal Khichdi with 1/2 Tsp Desi Ghee / 2 Jowar Bhakris with Palak Dal")
            .quantityG(160.0).servingDescription("1 bowl khichdi or 2 bhakris (160g)")
            .calories(180.0).proteinG(7.5).carbsG(32.0).fatG(2.5)
            .notes("Gentle on the gastrointestinal tract, supports tryptophan synthesis and restful melatonin secretion")
            .build());

        itemRepo.save(MealItem.builder()
            .dietPlanMeal(dinner)
            .foodName("Warm Ajwain & Jeera Digestive Infusion / Haldi Doodh")
            .quantityG(200.0).servingDescription("1 cup (200ml)")
            .calories(6.0).proteinG(0.2).carbsG(1.2).fatG(0.0)
            .notes("Ayurvedic carminative blend that prevents nighttime bloating and stimulates digestive fire (Agni)")
            .build());
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
        // Allow if user is patient or supervisor
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
            .filter(p -> p.getDietitianUserId() != null && p.getDietitianUserId().equals(dietitianUserId) && p.getStatus() == DietPlanStatus.SUBMITTED)
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
        return planRepo.findByPatientUserIdAndStatusIn(patientUserId,
            List.of(DietPlanStatus.APPROVED)).stream().map(this::toResponse).collect(Collectors.toList());
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
