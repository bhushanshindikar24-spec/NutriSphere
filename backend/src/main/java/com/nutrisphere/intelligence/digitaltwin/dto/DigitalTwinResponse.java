package com.nutrisphere.intelligence.digitaltwin.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DigitalTwinResponse {
    private Long patientUserId;
    private String patientName;
    private Double currentWeightKg;
    private Double heightCm;
    private Double bmi;
    private String bloodType;
    private Double avgDailyCalories;
    private Double avgDailyProteinG;
    private Double avgDailyCarbsG;
    private Double avgDailyFatG;
    private Double avgDailyWaterMl;
    private Double targetCalories;
    private Double targetProteinG;
    private Double targetCarbsG;
    private Double targetFatG;
    private Double targetWaterMl;
    private Double adherencePercent;
    private int totalBarriers;
    private String dominantBarrier;
    private Double latestRealityScore;
    private String realityScoreInterpretation;
    private int totalFoodLogs;
    private List<Map<String, Object>> nutritionHistory;
    private String lastUpdated;
}
