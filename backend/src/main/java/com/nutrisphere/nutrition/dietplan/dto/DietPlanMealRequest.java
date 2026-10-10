package com.nutrisphere.nutrition.dietplan.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;
@Data
public class DietPlanMealRequest {
    @NotBlank private String mealType;
    private String mealName;
    private String scheduledTime;
    private String dayOfWeek;
    private String notes;
    private Integer sortOrder;
    private List<MealItemRequest> items;
}
