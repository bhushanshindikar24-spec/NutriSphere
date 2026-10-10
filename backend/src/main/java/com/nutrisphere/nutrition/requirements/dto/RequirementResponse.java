package com.nutrisphere.nutrition.requirements.dto;
import lombok.Data;
@Data
public class RequirementResponse {
    private Long id;
    private Long patientUserId;
    private Double caloriesTarget;
    private Double bmr;
    private Double tdee;
    private Double proteinGTarget;
    private Double carbsGTarget;
    private Double fatGTarget;
    private Double fiberGTarget;
    private Double waterMlTarget;
    private String calculationMethod;
    private String notes;
    private boolean active;
}
