package com.nutrisphere.ai.dto;

import lombok.Data;
import java.util.List;

@Data
public class AIRecommendationRequest {
    private Long patientUserId;
    private String healthCondition;
    private List<String> dietaryPreferences;
    private List<String> allergies;
    private Double targetCalories;
    private String notes;
}
