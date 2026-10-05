package com.nutrisphere.intelligence.adaptive.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdaptiveRecommendationResponse {
    private Long id;
    private Long patientUserId;
    private Long dietPlanId;
    private String recommendationType;
    private String title;
    private String description;
    private String detectedIssues;
    private String suggestedChanges;
    private String priority;
    private String status;
    private Long reviewedByUserId;
    private String reviewNotes;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
}
