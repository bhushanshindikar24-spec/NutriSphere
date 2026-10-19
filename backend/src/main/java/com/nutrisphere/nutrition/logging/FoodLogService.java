package com.nutrisphere.nutrition.logging;

import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.dto.*;
import com.nutrisphere.patient.PatientProfile;
import com.nutrisphere.patient.PatientRepository;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodLogService {
    private final FoodLogRepository logRepo;
    private final MealDeviationRepository deviationRepo;
    private final DietPlanRepository planRepo;
    private final DietPlanMealRepository mealRepo;
    private final WaterLogRepository waterLogRepo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final DoctorPatientRepository doctorPatientRepo;
    private final DietitianPatientRepository dietitianPatientRepo;

    @Transactional
    public FoodLogResponse logFood(Long patientUserId, FoodLogRequest req) {
        assertMealBelongsToPatient(req.getDietPlanMealId(), patientUserId);
        FoodLog log = FoodLog.builder()
            .patientUserId(patientUserId).foodItemId(req.getFoodItemId())
            .foodName(req.getFoodName()).logDate(req.getLogDate())
            .logTime(req.getLogTime()).mealType(req.getMealType())
            .quantityG(req.getQuantityG()).calories(req.getCalories())
            .proteinG(req.getProteinG()).carbsG(req.getCarbsG())
            .fatG(req.getFatG()).fiberG(req.getFiberG())
            .notes(req.getNotes()).dietPlanMealId(req.getDietPlanMealId())
            .difficultyReason(req.getDifficultyReason())
            .difficultyRating(req.getDifficultyRating())
            .symptomsReported(req.getSymptomsReported())
            .build();
        return toResponse(logRepo.save(log));
    }

    public List<FoodLogResponse> getLogsForDate(Long patientUserId, LocalDate date) {
        return logRepo.findByPatientUserIdAndLogDateOrderByLogTime(patientUserId, date)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<FoodLogResponse> getLogsForRange(Long patientUserId, LocalDate from, LocalDate to) {
        return logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(patientUserId, from, to)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void recordDeviation(Long patientUserId, MealDeviationRequest req) {
        assertMealBelongsToPatient(req.getDietPlanMealId(), patientUserId);
        MealDeviation d = MealDeviation.builder()
            .patientUserId(patientUserId).dietPlanMealId(req.getDietPlanMealId())
            .deviationDate(req.getDeviationDate()).reason(req.getReason())
            .actualFood(req.getActualFood()).notes(req.getNotes()).build();
        deviationRepo.save(d);
    }

    public PlannedVsActualResponse getPlannedVsActual(Long patientUserId, LocalDate date) {
        PlannedVsActualResponse r = new PlannedVsActualResponse();
        r.setDate(date);
        var logs = logRepo.findByPatientUserIdAndLogDateOrderByLogTime(patientUserId, date);
        r.setActualCalories(logs.stream().mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0).sum());
        r.setActualProteinG(logs.stream().mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0).sum());
        r.setActualCarbsG(logs.stream().mapToDouble(l -> l.getCarbsG() != null ? l.getCarbsG() : 0).sum());
        r.setActualFatG(logs.stream().mapToDouble(l -> l.getFatG() != null ? l.getFatG() : 0).sum());

        planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).ifPresent(plan -> {
            r.setPlannedCalories(plan.getTargetCalories() != null ? plan.getTargetCalories() : 0);
            r.setPlannedProteinG(plan.getTargetProteinG() != null ? plan.getTargetProteinG() : 0);
            r.setPlannedCarbsG(plan.getTargetCarbsG() != null ? plan.getTargetCarbsG() : 0);
            r.setPlannedFatG(plan.getTargetFatG() != null ? plan.getTargetFatG() : 0);
        });
        if (r.getPlannedCalories() != null && r.getPlannedCalories() > 0) {
            r.setAdherencePercent(Math.min(100, (r.getActualCalories() / r.getPlannedCalories()) * 100));
        }
        return r;
    }

    @Transactional
    public FoodLogResponse updateFoodLog(Long id, Long patientUserId, FoodLogRequest req) {
        FoodLog log = logRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("FoodLog", id));
        if (!log.getPatientUserId().equals(patientUserId)) {
            throw new com.nutrisphere.exception.ForbiddenException("Cannot edit another patient's food log");
        }
        if (req.getFoodName() != null && !req.getFoodName().isBlank()) log.setFoodName(req.getFoodName());
        if (req.getMealType() != null) log.setMealType(req.getMealType());
        if (req.getCalories() != null) log.setCalories(req.getCalories());
        if (req.getProteinG() != null) log.setProteinG(req.getProteinG());
        if (req.getCarbsG() != null) log.setCarbsG(req.getCarbsG());
        if (req.getFatG() != null) log.setFatG(req.getFatG());
        if (req.getFiberG() != null) log.setFiberG(req.getFiberG());
        if (req.getQuantityG() != null) log.setQuantityG(req.getQuantityG());
        if (req.getNotes() != null) log.setNotes(req.getNotes());
        if (req.getLogDate() != null) log.setLogDate(req.getLogDate());
        if (req.getLogTime() != null) log.setLogTime(req.getLogTime());
        if (req.getDifficultyReason() != null) log.setDifficultyReason(req.getDifficultyReason());
        if (req.getDifficultyRating() != null) log.setDifficultyRating(req.getDifficultyRating());
        if (req.getSymptomsReported() != null) log.setSymptomsReported(req.getSymptomsReported());
        return toResponse(logRepo.save(log));
    }

    @Transactional
    public void deleteFoodLog(Long id, Long patientUserId) {
        FoodLog log = logRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("FoodLog", id));
        if (!log.getPatientUserId().equals(patientUserId)) {
            throw new com.nutrisphere.exception.ForbiddenException("Cannot delete another patient's food log");
        }
        logRepo.delete(log);
    }

    /**
     * Requirement 10: Ingredient-Based Meal Builder direct logging
     */
    @Transactional
    public List<FoodLogResponse> logCustomMeal(Long patientUserId, MealBuilderRequest req) {
        LocalDate date = req.getLogDate() != null ? req.getLogDate() : LocalDate.now();
        String mealType = req.getMealType() != null ? req.getMealType().toUpperCase() : "LUNCH";
        List<FoodLog> logsToSave = new ArrayList<>();

        if (req.getIngredients() == null || req.getIngredients().isEmpty()) {
            throw new IllegalArgumentException("At least one ingredient is required to build a meal");
        }

        double totalCalories = 0.0;
        double totalProtein = 0.0;
        double totalCarbs = 0.0;
        double totalFat = 0.0;
        double totalFiber = 0.0;
        StringBuilder recipeIngredients = new StringBuilder();

        for (MealBuilderRequest.IngredientItem item : req.getIngredients()) {
            double c = item.getCalories() != null ? item.getCalories() : 0.0;
            double p = item.getProteinG() != null ? item.getProteinG() : 0.0;
            double cb = item.getCarbsG() != null ? item.getCarbsG() : 0.0;
            double f = item.getFatG() != null ? item.getFatG() : 0.0;
            double fb = item.getFiberG() != null ? item.getFiberG() : 0.0;

            totalCalories += c;
            totalProtein += p;
            totalCarbs += cb;
            totalFat += f;
            totalFiber += fb;

            if (recipeIngredients.length() > 0) recipeIngredients.append(", ");
            recipeIngredients.append(item.getFoodName()).append(" (").append(item.getQuantity()).append(" ").append(item.getUnit() != null ? item.getUnit() : "g").append(")");
        }

        String notes = "Custom Recipe [" + req.getMealName() + "]: " + recipeIngredients;
        if (req.getNotes() != null && !req.getNotes().isBlank()) {
            notes += " | Note: " + req.getNotes();
        }

        // Consolidated entry for the built meal
        FoodLog consolidatedLog = FoodLog.builder()
            .patientUserId(patientUserId)
            .foodName(req.getMealName())
            .mealType(mealType)
            .logDate(date)
            .logTime(LocalTime.now())
            .calories(Math.round(totalCalories * 10.0) / 10.0)
            .proteinG(Math.round(totalProtein * 10.0) / 10.0)
            .carbsG(Math.round(totalCarbs * 10.0) / 10.0)
            .fatG(Math.round(totalFat * 10.0) / 10.0)
            .fiberG(Math.round(totalFiber * 10.0) / 10.0)
            .quantityG(100.0)
            .notes(notes)
            .build();

        return List.of(toResponse(logRepo.save(consolidatedLog)));
    }

    /**
     * Requirement 7: Automated Daily Nutrition Report for Patient and Assigned Doctor/Dietitian
     */
    public DailyNutritionReportResponse buildDailyReport(Long patientUserId, LocalDate date) {
        String patientName = userRepo.findById(patientUserId).map(u -> u.getFullName()).orElse("Patient");
        List<FoodLog> logs = logRepo.findByPatientUserIdAndLogDateOrderByLogTime(patientUserId, date);

        double actualCalories = logs.stream().mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0.0).sum();
        double actualProtein = logs.stream().mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0.0).sum();
        double actualCarbs = logs.stream().mapToDouble(l -> l.getCarbsG() != null ? l.getCarbsG() : 0.0).sum();
        double actualFat = logs.stream().mapToDouble(l -> l.getFatG() != null ? l.getFatG() : 0.0).sum();

        Double waterMl = waterLogRepo.sumAmountForDate(patientUserId, date);
        double actualWaterMl = waterMl != null ? waterMl : 0.0;

        // Fetch targets
        double plannedCalories = 2000.0;
        double plannedProtein = 75.0;
        double plannedCarbs = 220.0;
        double plannedFat = 55.0;
        double plannedWaterMl = 2500.0;

        var approvedPlan = planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED);
        if (approvedPlan.isPresent()) {
            DietPlan p = approvedPlan.get();
            if (p.getTargetCalories() != null && p.getTargetCalories() > 0) plannedCalories = p.getTargetCalories();
            if (p.getTargetProteinG() != null && p.getTargetProteinG() > 0) plannedProtein = p.getTargetProteinG();
            if (p.getTargetCarbsG() != null && p.getTargetCarbsG() > 0) plannedCarbs = p.getTargetCarbsG();
            if (p.getTargetFatG() != null && p.getTargetFatG() > 0) plannedFat = p.getTargetFatG();
            if (p.getTargetWaterMl() != null && p.getTargetWaterMl() > 0) plannedWaterMl = p.getTargetWaterMl();
        } else {
            PatientProfile prof = patientRepo.findByUserId(patientUserId).orElse(null);
            if (prof != null) {
                if (prof.getTargetDailyCalories() != null && prof.getTargetDailyCalories() > 0) plannedCalories = prof.getTargetDailyCalories();
                if (prof.getTargetDailyWaterMl() != null && prof.getTargetDailyWaterMl() > 0) plannedWaterMl = prof.getTargetDailyWaterMl();
            }
        }

        double calScore = plannedCalories > 0 ? Math.min(100.0, (actualCalories / plannedCalories) * 100.0) : 0;
        double waterScore = plannedWaterMl > 0 ? Math.min(100.0, (actualWaterMl / plannedWaterMl) * 100.0) : 0;
        int adherence = (int) Math.round((calScore + waterScore) / 2.0);

        String adherenceStatus = adherence >= 85 ? "OPTIMAL" : (adherence >= 65 ? "ON_TRACK" : "NEEDS_ADJUSTMENT");

        // Doctor and Dietitian Names
        String docName = doctorPatientRepo.findByPatientUserIdAndActiveTrue(patientUserId).stream().findFirst()
            .flatMap(a -> userRepo.findById(a.getDoctorUserId()))
            .map(u -> "Dr. " + u.getFullName()).orElse("Assigned Medical Supervisor");

        String dietName = dietitianPatientRepo.findByPatientUserIdAndActiveTrue(patientUserId).stream().findFirst()
            .flatMap(a -> userRepo.findById(a.getDietitianUserId()))
            .map(u -> u.getFullName()).orElse("Assigned Clinical Dietitian");

        // Collect difficulty feedback & notes
        List<DailyNutritionReportResponse.PatientDifficultyItem> difficulties = new ArrayList<>();
        List<String> patientNotes = new ArrayList<>();

        for (FoodLog l : logs) {
            if (l.getDifficultyReason() != null && !l.getDifficultyReason().isBlank() && !l.getDifficultyReason().equalsIgnoreCase("None")) {
                difficulties.add(DailyNutritionReportResponse.PatientDifficultyItem.builder()
                    .mealType(l.getMealType())
                    .foodName(l.getFoodName())
                    .difficultyReason(l.getDifficultyReason())
                    .difficultyRating(l.getDifficultyRating() != null ? l.getDifficultyRating() : 3)
                    .symptomsReported(l.getSymptomsReported())
                    .notes(l.getNotes())
                    .build());
            }
            if (l.getNotes() != null && !l.getNotes().isBlank()) {
                patientNotes.add(l.getMealType() + ": " + l.getNotes());
            }
        }

        // Also check MealDeviation table for any additional deviations logged today
        deviationRepo.findByPatientUserIdAndDeviationDate(patientUserId, date).forEach(d -> {
            difficulties.add(DailyNutritionReportResponse.PatientDifficultyItem.builder()
                .mealType("Meal Deviation")
                .foodName(d.getActualFood() != null ? d.getActualFood() : "Off-plan food")
                .difficultyReason(d.getReason() != null ? d.getReason() : "Diet deviation")
                .difficultyRating(4)
                .notes(d.getNotes())
                .build());
        });

        return DailyNutritionReportResponse.builder()
            .patientUserId(patientUserId)
            .patientName(patientName)
            .reportDate(date)
            .assignedDoctorName(docName)
            .assignedDietitianName(dietName)
            .plannedCalories(Math.round(plannedCalories * 10.0) / 10.0)
            .actualCalories(Math.round(actualCalories * 10.0) / 10.0)
            .calorieGap(Math.round((actualCalories - plannedCalories) * 10.0) / 10.0)
            .plannedProteinG(Math.round(plannedProtein * 10.0) / 10.0)
            .actualProteinG(Math.round(actualProtein * 10.0) / 10.0)
            .proteinGap(Math.round((actualProtein - plannedProtein) * 10.0) / 10.0)
            .plannedCarbsG(Math.round(plannedCarbs * 10.0) / 10.0)
            .actualCarbsG(Math.round(actualCarbs * 10.0) / 10.0)
            .carbsGap(Math.round((actualCarbs - plannedCarbs) * 10.0) / 10.0)
            .plannedFatG(Math.round(plannedFat * 10.0) / 10.0)
            .actualFatG(Math.round(actualFat * 10.0) / 10.0)
            .fatGap(Math.round((actualFat - plannedFat) * 10.0) / 10.0)
            .plannedWaterMl(Math.round(plannedWaterMl * 10.0) / 10.0)
            .actualWaterMl(Math.round(actualWaterMl * 10.0) / 10.0)
            .waterGap(Math.round((actualWaterMl - plannedWaterMl) * 10.0) / 10.0)
            .adherencePercentage(adherence)
            .adherenceStatus(adherenceStatus)
            .loggedItems(logs.stream().map(this::toResponse).collect(Collectors.toList()))
            .difficultyReports(difficulties)
            .patientNotes(patientNotes)
            .clinicalReviewStatus("AUTOMATICALLY_SHARED_WITH_CARE_TEAM")
            .build();
    }

    private void assertMealBelongsToPatient(Long mealId, Long patientUserId) {
        if (mealId == null) return;
        DietPlanMeal meal = mealRepo.findById(mealId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlanMeal", mealId));
        if (meal.getDietPlan() == null || !patientUserId.equals(meal.getDietPlan().getPatientUserId())) {
            throw new com.nutrisphere.exception.ForbiddenException("Diet plan meal does not belong to this patient");
        }
    }

    private FoodLogResponse toResponse(FoodLog l) {
        FoodLogResponse r = new FoodLogResponse();
        r.setId(l.getId());
        r.setPatientUserId(l.getPatientUserId());
        r.setFoodItemId(l.getFoodItemId());
        r.setFoodName(l.getFoodName());
        r.setLogDate(l.getLogDate());
        r.setLogTime(l.getLogTime());
        r.setMealType(l.getMealType());
        r.setQuantityG(l.getQuantityG());
        r.setCalories(l.getCalories());
        r.setProteinG(l.getProteinG());
        r.setCarbsG(l.getCarbsG());
        r.setFatG(l.getFatG());
        r.setFiberG(l.getFiberG());
        r.setNotes(l.getNotes());
        r.setDietPlanMealId(l.getDietPlanMealId());
        r.setDifficultyReason(l.getDifficultyReason());
        r.setDifficultyRating(l.getDifficultyRating());
        r.setSymptomsReported(l.getSymptomsReported());
        return r;
    }
}
