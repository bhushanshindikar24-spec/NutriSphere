package com.nutrisphere.intelligence.digitaltwin.dto;

import lombok.Data;

@Data
public class DigitalTwinSummaryResponse {
    private Long patientUserId;
    private String patientName;
    private Double bmi;
    private Double adherencePercent;
    private Double latestRealityScore;
    private String realityScoreInterpretation;
    private int totalBarriers;
    private String dominantBarrier;
    private Double avgDailyCalories;
    private Double avgDailyProteinG;
    private Double avgDailyWaterMl;
    private String lastUpdated;
}
