package com.nutrisphere.nutrition.logging.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class MealDeviationRequest {
    private Long dietPlanMealId;
    private LocalDate deviationDate;
    private String reason;
    private String actualFood;
    private String notes;
}
