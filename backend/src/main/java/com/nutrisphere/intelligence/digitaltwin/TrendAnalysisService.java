package com.nutrisphere.intelligence.digitaltwin;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

/**
 * TrendAnalysisService analyzes longitudinal nutrition data to identify
 * meaningful trends and patterns in the patient's digital twin.
 */
@Service
@RequiredArgsConstructor
public class TrendAnalysisService {
    private final com.nutrisphere.nutrition.logging.FoodLogRepository logRepo;
    private final com.nutrisphere.nutrition.hydration.WaterLogRepository waterRepo;

    /**
     * Calculate weekly nutrition trend for the past N weeks.
     */
    public List<Map<String, Object>> weeklyNutritionTrend(Long patientUserId, int weeks) {
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int w = weeks - 1; w >= 0; w--) {
            LocalDate weekStart = today.minusDays((w + 1) * 7L);
            LocalDate weekEnd = today.minusDays(w * 7L);

            var logs = logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(
                patientUserId, weekStart, weekEnd);

            double avgCalories = logs.stream()
                .mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0).average().orElse(0);
            double avgProtein = logs.stream()
                .mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0).average().orElse(0);

            double totalWater = 0;
            for (int d = 0; d < 7; d++) {
                totalWater += waterRepo.sumAmountForDate(patientUserId, weekStart.plusDays(d));
            }

            Map<String, Object> weekData = new LinkedHashMap<>();
            weekData.put("weekStart", weekStart.toString());
            weekData.put("weekEnd", weekEnd.toString());
            weekData.put("avgCalories", Math.round(avgCalories * 10.0) / 10.0);
            weekData.put("avgProteinG", Math.round(avgProtein * 10.0) / 10.0);
            weekData.put("avgWaterMl", Math.round((totalWater / 7.0) * 10.0) / 10.0);
            weekData.put("logCount", logs.size());
            trend.add(weekData);
        }
        return trend;
    }

    /**
     * Identify if nutrition metrics are improving, declining, or stable.
     */
    public Map<String, String> getNutritionDirection(Long patientUserId) {
        LocalDate today = LocalDate.now();
        var lastWeek = logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(
            patientUserId, today.minusDays(7), today);
        var prevWeek = logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(
            patientUserId, today.minusDays(14), today.minusDays(7));

        Map<String, String> directions = new LinkedHashMap<>();

        double lastCalAvg = lastWeek.stream().mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0).average().orElse(0);
        double prevCalAvg = prevWeek.stream().mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0).average().orElse(0);
        directions.put("calories", lastCalAvg > prevCalAvg * 1.05 ? "INCREASING" : lastCalAvg < prevCalAvg * 0.95 ? "DECREASING" : "STABLE");

        double lastProtAvg = lastWeek.stream().mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0).average().orElse(0);
        double prevProtAvg = prevWeek.stream().mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0).average().orElse(0);
        directions.put("protein", lastProtAvg > prevProtAvg * 1.05 ? "INCREASING" : lastProtAvg < prevProtAvg * 0.95 ? "DECREASING" : "STABLE");

        return directions;
    }
}
