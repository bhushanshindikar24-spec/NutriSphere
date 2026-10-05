package com.nutrisphere.nutrition.dietplan.dto;
import lombok.Data;
@Data
public class MealItemResponse {
    private Long id;
    private Long foodItemId;
    private String foodName;
    private Double quantityG;
    private String servingDescription;
    private Double calories;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;
    private String notes;
}
