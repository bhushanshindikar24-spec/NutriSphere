package com.nutrisphere.nutrition.logging.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class FoodLogRequest {
    private Long foodItemId;
    @NotBlank private String foodName;
    @NotNull private LocalDate logDate;
    private LocalTime logTime;
    private String mealType;
    @PositiveOrZero private Double quantityG;
    @PositiveOrZero private Double calories;
    @PositiveOrZero private Double proteinG;
    @PositiveOrZero private Double carbsG;
    @PositiveOrZero private Double fatG;
    @PositiveOrZero private Double fiberG;
    private String notes;
    private Long dietPlanMealId;
}
