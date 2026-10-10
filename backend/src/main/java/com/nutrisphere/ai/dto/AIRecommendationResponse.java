package com.nutrisphere.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIRecommendationResponse {
    private String summary;
    private List<String> recommendations;
    private List<String> foodsToEncourage;
    private List<String> foodsToAvoid;
    private String clinicalRationale;
    private String disclaimer;
    @Builder.Default
    private boolean requiresDietitianApproval = true;
    @Builder.Default
    private boolean decisionSupportOnly = true;
    @Builder.Default
    private String guardrailStatus = "VALIDATED_DECISION_SUPPORT";
    private LocalDateTime generatedAt;
}
