package com.nutrisphere.nutrition.requirements.dto;

import com.nutrisphere.common.enums.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequirementCalculationRequest {
    @NotNull @Positive private Double weightKg;
    @NotNull @Positive private Double heightCm;
    @NotNull @Positive private Integer ageYears;
    @NotNull private Gender gender;
    @NotNull private ActivityLevel activityLevel;
    private String goal;
    private String formula; // "MIFFLIN_ST_JEOR" or "HARRIS_BENEDICT"
    private Long patientUserId;
    private List<String> conditions;
    private List<String> deficiencies;
}
