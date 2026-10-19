package com.nutrisphere.medical.laboratory.dto;

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
public class BloodReportAnalysisResponse {
    private Long reportId;
    private String title;
    private LocalDate reportDate;
    private String aiSummary;
    private List<DeficiencyItem> identifiedDeficiencies;
    private List<String> recommendedFoodSources;
    private String dietPlanConsiderations;
    private boolean reviewedByDoctor;
    private String doctorReviewNotes;
    private String clinicalDisclaimer;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeficiencyItem {
        private String biomarker;
        private String measuredValue;
        private String normalRange;
        private String status; // DEFICIENT, ELEVATED, BORDERLINE, OPTIMAL
        private String simpleLanguageExplanation;
        private List<String> targetFoods;
        private String clinicalSignificance;
    }
}
