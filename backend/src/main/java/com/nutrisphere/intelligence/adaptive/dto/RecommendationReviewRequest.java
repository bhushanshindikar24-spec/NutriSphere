package com.nutrisphere.intelligence.adaptive.dto;

import lombok.Data;

@Data
public class RecommendationReviewRequest {
    private boolean approved;
    private String notes;
}
