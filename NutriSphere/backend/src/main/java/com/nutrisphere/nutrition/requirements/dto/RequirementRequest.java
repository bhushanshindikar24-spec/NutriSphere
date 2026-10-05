package com.nutrisphere.nutrition.requirements.dto;
import lombok.Data;
@Data
public class RequirementRequest {
    private Long patientUserId;
    private Double caloriesTarget;
    private Double proteinGTarget;
    private Double carbsGTarget;
    private Double fatGTarget;
    private Double fiberGTarget;
    private Double waterMlTarget;
    private String notes;
}
