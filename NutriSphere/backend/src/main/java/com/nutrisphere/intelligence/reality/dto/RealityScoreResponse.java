package com.nutrisphere.intelligence.reality.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RealityScoreResponse {
    private Long id;
    private Long patientUserId;
    private Long dietPlanId;
    private Double overallScore;
    private String interpretation;
    private String explanation;
    private Map<String, Double> dimensionScores;
    private List<RealityScoreBreakdownResponse> breakdowns;
    private LocalDateTime calculatedAt;
}
