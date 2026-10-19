package com.nutrisphere.nutrition.logging.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyNutritionReportResponse {
    private Long patientUserId;
    private String patientName;
    private LocalDate reportDate;
    private String assignedDoctorName;
    private String assignedDietitianName;

    // Macro comparison: Planned vs Actual
    private Double plannedCalories;
    private Double actualCalories;
    private Double calorieGap; // actual - planned

    private Double plannedProteinG;
    private Double actualProteinG;
    private Double proteinGap;

    private Double plannedCarbsG;
    private Double actualCarbsG;
    private Double carbsGap;

    private Double plannedFatG;
    private Double actualFatG;
    private Double fatGap;

    private Double plannedWaterMl;
    private Double actualWaterMl;
    private Double waterGap;

    private Integer adherencePercentage;
    private String adherenceStatus; // OPTIMAL, ON_TRACK, NEEDS_ADJUSTMENT

    private List<FoodLogResponse> loggedItems;
    private List<PatientDifficultyItem> difficultyReports;
    private List<String> patientNotes;
    private String clinicalReviewStatus;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientDifficultyItem {
        private String mealType;
        private String foodName;
        private String difficultyReason;
        private Integer difficultyRating;
        private String symptomsReported;
        private String notes;
    }
}
