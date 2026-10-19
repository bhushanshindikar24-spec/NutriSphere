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
public class LongitudinalComparisonResponse {
    private Long patientUserId;
    private String patientName;
    private LocalDate latestReportDate;
    private LocalDate previousReportDate;
    private List<BiomarkerComparison> comparisons;
    private List<String> nutritionalImprovements;
    private List<String> areasOfConcern;
    private String aiDietCorrelation;
    private String patientFriendlyInsights;
    private String clinicalDoctorNotes;
    private String clinicalDisclaimer;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BiomarkerComparison {
        private String parameterName;
        private String previousValue;
        private String latestValue;
        private String unit;
        private String normalRange;
        private String changeStatus; // IMPROVED, WORSENED, STABLE, NEW_DEFICIENCY
        private String statusBadgeColor; // green, red, blue, amber
        private String aiPossibleExplanation;
        private Double previousNumeric;
        private Double latestNumeric;
    }
}
