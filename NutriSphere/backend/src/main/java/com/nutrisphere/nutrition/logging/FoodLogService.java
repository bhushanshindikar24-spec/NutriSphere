package com.nutrisphere.nutrition.logging;

import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.logging.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class FoodLogService {
    private final FoodLogRepository logRepo;
    private final MealDeviationRepository deviationRepo;
    private final DietPlanRepository planRepo;

    @Transactional
    public FoodLogResponse logFood(Long patientUserId, FoodLogRequest req) {
        FoodLog log = FoodLog.builder()
            .patientUserId(patientUserId).foodItemId(req.getFoodItemId())
            .foodName(req.getFoodName()).logDate(req.getLogDate())
            .logTime(req.getLogTime()).mealType(req.getMealType())
            .quantityG(req.getQuantityG()).calories(req.getCalories())
            .proteinG(req.getProteinG()).carbsG(req.getCarbsG())
            .fatG(req.getFatG()).fiberG(req.getFiberG())
            .notes(req.getNotes()).dietPlanMealId(req.getDietPlanMealId())
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
        MealDeviation d = MealDeviation.builder()
            .patientUserId(patientUserId).dietPlanMealId(req.getDietPlanMealId())
            .deviationDate(req.getDeviationDate()).reason(req.getReason())
            .actualFood(req.getActualFood()).notes(req.getNotes()).build();
        deviationRepo.save(d);
    }

    public PlannedVsActualResponse getPlannedVsActual(Long patientUserId, LocalDate date) {
        PlannedVsActualResponse r = new PlannedVsActualResponse();
        r.setDate(date);
        // Actual
        var logs = logRepo.findByPatientUserIdAndLogDateOrderByLogTime(patientUserId, date);
        r.setActualCalories(logs.stream().mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0).sum());
        r.setActualProteinG(logs.stream().mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0).sum());
        r.setActualCarbsG(logs.stream().mapToDouble(l -> l.getCarbsG() != null ? l.getCarbsG() : 0).sum());
        r.setActualFatG(logs.stream().mapToDouble(l -> l.getFatG() != null ? l.getFatG() : 0).sum());
        // Planned from approved diet plan
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

    private FoodLogResponse toResponse(FoodLog l) {
        FoodLogResponse r = new FoodLogResponse();
        r.setId(l.getId()); r.setPatientUserId(l.getPatientUserId());
        r.setFoodItemId(l.getFoodItemId()); r.setFoodName(l.getFoodName());
        r.setLogDate(l.getLogDate()); r.setLogTime(l.getLogTime());
        r.setMealType(l.getMealType()); r.setQuantityG(l.getQuantityG());
        r.setCalories(l.getCalories()); r.setProteinG(l.getProteinG());
        r.setCarbsG(l.getCarbsG()); r.setFatG(l.getFatG());
        r.setFiberG(l.getFiberG()); r.setNotes(l.getNotes());
        return r;
    }
}
