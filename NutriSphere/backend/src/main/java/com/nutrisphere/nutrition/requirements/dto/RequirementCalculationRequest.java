package com.nutrisphere.nutrition.requirements.dto;

import com.nutrisphere.common.enums.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RequirementCalculationRequest {
    @NotNull @Positive private Double weightKg;
    @NotNull @Positive private Double heightCm;
    @NotNull @Positive private Integer ageYears;
    @NotNull private Gender gender;
    @NotNull private ActivityLevel activityLevel;
    private String goal;
    private String formula; // "MIFFLIN_ST_JEOR" or "HARRIS_BENEDICT"
}
