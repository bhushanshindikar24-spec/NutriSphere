package com.nutrisphere.intelligence.reality;

import com.nutrisphere.intelligence.adherence.AdherenceBarrierRepository;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service @RequiredArgsConstructor
public class RealityScoreService {
    private final RealityScoreRepository repo;
    private final AdherenceBarrierRepository barrierRepo;
    private final FoodLogRepository logRepo;
    private final DietPlanRepository planRepo;

    /**
     * Reality Score calculation is transparent and documented:
     * - Food Availability: based on food_unavailable barriers (lower = lower score)
     * - Affordability: based on too_expensive barriers
     * - Cooking Complexity: based on cooking_problem barriers
     * - Preference: based on taste barriers
     * - Schedule: based on busy_schedule barriers
     * - Accessibility: average of above
     * - Historical Adherence: calculated from actual vs planned calorie ratio over last 7 days
     * - Overall: weighted average of all dimensions
     */
    @Transactional
    public void assertDietPlanBelongsToPatient(Long dietPlanId, Long patientUserId) {
        if (dietPlanId != null) {
            DietPlan plan = planRepo.findById(dietPlanId)
                .orElseThrow(() -> new com.nutrisphere.exception.ResourceNotFoundException("DietPlan", dietPlanId));
            if (!patientUserId.equals(plan.getPatientUserId())) {
                throw new com.nutrisphere.exception.ForbiddenException("Diet plan does not belong to this patient");
            }
        }
    }

    public RealityScoreResult calculateAndSave(Long patientUserId, Long dietPlanId) {
        List<Object[]> barrierCounts = barrierRepo.countByBarrierType(patientUserId);
        Map<String, Long> counts = new HashMap<>();
        long totalBarriers = 0;
        for (Object[] row : barrierCounts) {
            counts.put((String) row[0], (Long) row[1]);
            totalBarriers += (Long) row[1];
        }

        // 6 Dimensions from Specification Section 17:
        // Food Availability: 20%, Affordability: 20%, Cooking Complexity: 15%, Preference: 15%, Schedule Alignment: 15%, Historical Adherence: 15%
        long unavailCount = counts.getOrDefault("FOOD_UNAVAILABLE", 0L);
        long costCount = counts.getOrDefault("COST", 0L) + counts.getOrDefault("TOO_EXPENSIVE", 0L);
        long cookingCount = counts.getOrDefault("COOKING_SKILL", 0L) + counts.getOrDefault("COOKING_PROBLEM", 0L);
        long preferenceCount = counts.getOrDefault("CRAVINGS_HUNGER", 0L) + counts.getOrDefault("TASTE", 0L);
        long scheduleCount = counts.getOrDefault("TIME_CONSTRAINT", 0L) + counts.getOrDefault("BUSY_SCHEDULE", 0L);

        double foodAvail = calcDimensionScore(unavailCount, totalBarriers);
        double afford = calcDimensionScore(costCount, totalBarriers);
        double cooking = calcDimensionScore(cookingCount, totalBarriers);
        double preference = calcDimensionScore(preferenceCount, totalBarriers);
        double schedule = calcDimensionScore(scheduleCount, totalBarriers);
        double adherence = calcHistoricalAdherence(patientUserId, dietPlanId);

        // Weighted overall sum = 0.20 + 0.20 + 0.15 + 0.15 + 0.15 + 0.15 = 1.00 (100%)
        double overall = (foodAvail * 0.20 + afford * 0.20 + cooking * 0.15 + preference * 0.15 +
                          schedule * 0.15 + adherence * 0.15);

        RealityScore score = RealityScore.builder()
            .patientUserId(patientUserId).dietPlanId(dietPlanId)
            .overallScore(Math.round(overall * 10.0) / 10.0)
            .foodAvailabilityScore(foodAvail).affordabilityScore(afford)
            .cookingComplexityScore(cooking).preferenceScore(preference)
            .scheduleScore(schedule).accessibilityScore((foodAvail + afford) / 2.0)
            .historicalAdherenceScore(adherence)
            .explanation(buildExplanation(foodAvail, afford, cooking, preference, schedule, adherence))
            .build();
        repo.save(score);
        return toResult(score);
    }

    public List<RealityScoreResult> getHistory(Long patientUserId) {
        return repo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId).stream()
            .map(this::toResult).toList();
    }

    private double calcDimensionScore(long barrierCount, long total) {
        if (total == 0) return 75.0; // neutral
        double pct = (double) barrierCount / total;
        return Math.max(0, 100 - (pct * 200)); // penalize proportion
    }

    private double calcHistoricalAdherence(Long patientUserId, Long dietPlanId) {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);
        DietPlan plan = dietPlanId != null
            ? planRepo.findById(dietPlanId).orElse(null)
            : planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).orElse(null);

        if (plan == null || plan.getTargetCalories() == null || plan.getTargetCalories() <= 0) {
            return 0.0;
        }

        var logs = logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(
            patientUserId, weekAgo, today);
        double totalActual = logs.stream()
            .mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0.0)
            .sum();
        double planned = plan.getTargetCalories() * 7.0;

        if (planned <= 0) return 0.0;
        double ratio = totalActual / planned;
        return Math.max(0.0, Math.min(100.0, ratio * 100.0));
    }

    private String buildExplanation(double foodAvail, double afford, double cooking, double preference, double schedule, double adherence) {
        StringBuilder sb = new StringBuilder("Reality Score Breakdown: ");
        sb.append(String.format("Food Availability=%.1f, Affordability=%.1f, Cooking=%.1f, Preference=%.1f, Schedule=%.1f, Adherence=%.1f.", foodAvail, afford, cooking, preference, schedule, adherence));
        return sb.toString();
    }

    private RealityScoreResult toResult(RealityScore s) {
        RealityScoreResult r = new RealityScoreResult();
        r.setPatientUserId(s.getPatientUserId());
        r.setDietPlanId(s.getDietPlanId());
        r.setOverallScore(s.getOverallScore() != null ? s.getOverallScore() : 0);
        r.setExplanation(s.getExplanation());
        Map<String, Double> dims = new LinkedHashMap<>();
        dims.put("Food Availability", s.getFoodAvailabilityScore());
        dims.put("Affordability", s.getAffordabilityScore());
        dims.put("Cooking Complexity", s.getCookingComplexityScore());
        dims.put("Preference", s.getPreferenceScore());
        dims.put("Schedule", s.getScheduleScore());
        dims.put("Historical Adherence", s.getHistoricalAdherenceScore());
        r.setDimensionScores(dims);
        double score = r.getOverallScore();
        r.setInterpretation(score >= 80 ? "High Feasibility" : score >= 60 ? "Moderate Feasibility" : "High Friction Risk - Reassessment Recommended");
        return r;
    }
}
