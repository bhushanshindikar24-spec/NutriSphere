package com.nutrisphere.nutrition.food.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodCalculateResponse {
    private Long foodItemId;
    private String foodName;
    private Double quantity;
    private String unit;
    private Double calculatedGrams;
    private Double calories;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;
    private Double fiberG;
    private Double sugarG;
    private Double sodiumMg;
    private String servingDescription;
    private String category;
}
