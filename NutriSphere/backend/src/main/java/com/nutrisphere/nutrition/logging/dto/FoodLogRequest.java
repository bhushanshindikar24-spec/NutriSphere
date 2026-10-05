package com.nutrisphere.nutrition.logging.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    private Double quantityG;
    private Double calories;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;
    private Double fiberG;
    private String notes;
    private Long dietPlanMealId;
}
