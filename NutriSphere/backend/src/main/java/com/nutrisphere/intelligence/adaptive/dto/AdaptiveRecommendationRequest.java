package com.nutrisphere.intelligence.adaptive.dto;

import lombok.Data;

@Data
public class AdaptiveRecommendationRequest {
    private Long patientUserId;
    private Long dietPlanId;
}
