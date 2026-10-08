package com.nutrisphere.nutrition.dietplan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DietPlanRequest {
    @NotNull private Long patientUserId;
    @NotBlank private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    @PositiveOrZero private Double targetCalories;
    @PositiveOrZero private Double targetProteinG;
    @PositiveOrZero private Double targetCarbsG;
    @PositiveOrZero private Double targetFatG;
    @PositiveOrZero private Double targetFiberG;
    @PositiveOrZero private Double targetWaterMl;
    private String notes;
}
