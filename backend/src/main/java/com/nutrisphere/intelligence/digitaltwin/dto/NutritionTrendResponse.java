package com.nutrisphere.intelligence.digitaltwin.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class NutritionTrendResponse {
    private Long patientUserId;
    private List<Map<String, Object>> weeklyTrend;
    private Map<String, String> nutritionDirection;
}
