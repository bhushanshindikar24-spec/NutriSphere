package com.nutrisphere.nutrition.dietplan.dto;
import lombok.Data;
import java.util.List;
@Data
public class DietPlanMealResponse {
    private Long id;
    private String mealType;
    private String mealName;
    private String scheduledTime;
    private String dayOfWeek;
    private String notes;
    private Integer sortOrder;
    private List<MealItemResponse> items;
    private Double totalCalories;
    private Double totalProteinG;
}
