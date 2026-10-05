package com.nutrisphere.nutrition.requirements.dto;
import com.nutrisphere.common.enums.*;
import lombok.Data;
@Data
public class RequirementCalculationRequest {
    private Double weightKg;
    private Double heightCm;
    private Integer ageYears;
    private Gender gender;
    private ActivityLevel activityLevel;
    private String goal; // WEIGHT_LOSS, MAINTENANCE, MUSCLE_GAIN
}
