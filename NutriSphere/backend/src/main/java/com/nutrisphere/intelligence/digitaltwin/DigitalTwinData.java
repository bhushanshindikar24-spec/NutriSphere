package com.nutrisphere.intelligence.digitaltwin;
import lombok.Data;
import java.time.LocalDate;
import java.util.*;
@Data
public class DigitalTwinData {
    private Long patientUserId;
    private String patientName;
    // Health
    private Double currentWeightKg;
    private Double heightCm;
    private Double bmi;
    private String bloodType;
    private List<String> conditions;
    // Nutrition (7-day averages)
    private Double avgDailyCalories;
    private Double avgDailyProteinG;
    private Double avgDailyCarbsG;
    private Double avgDailyFatG;
    private Double avgDailyFiberG;
    private Double avgDailyWaterMl;
    // Targets
    private Double targetCalories;
    private Double targetProteinG;
    private Double targetCarbsG;
    private Double targetFatG;
    private Double targetWaterMl;
    private Double netCaloricDeficit;
    private Double projectedWeight30Days;
    // Adherence
    private Double adherencePercent;
    private Integer totalFoodLogs;
    private Integer totalWaterLogs;
    private Integer totalBarriers;
    private String dominantBarrier;
    private Map<String, Double> dimensionScores;
    // Trends
    private List<DailyNutrition> nutritionHistory;
    private List<WeightRecord> weightHistory;
    // Reality Score
    private Double latestRealityScore;
    private String realityScoreInterpretation;
    private java.time.LocalDateTime lastUpdated;

    @Data
    public static class DailyNutrition {
        private LocalDate date;
        private double calories;
        private double proteinG;
        private double carbsG;
        private double fatG;
        private double waterMl;
    }

    @Data
    public static class WeightRecord {
        private LocalDate date;
        private double weightKg;
    }
}
