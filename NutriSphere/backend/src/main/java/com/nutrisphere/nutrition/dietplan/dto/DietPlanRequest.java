package com.nutrisphere.nutrition.dietplan.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
@Data
public class DietPlanRequest {
    @NotNull private Long patientUserId;
    @NotBlank private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double targetCalories;
    private Double targetProteinG;
    private Double targetCarbsG;
    private Double targetFatG;
    private Double targetFiberG;
    private Double targetWaterMl;
    private String notes;
}
