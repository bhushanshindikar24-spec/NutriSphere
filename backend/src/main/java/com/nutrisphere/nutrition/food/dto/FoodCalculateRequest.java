package com.nutrisphere.nutrition.food.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodCalculateRequest {
    private Long foodItemId;
    private String foodName;
    private Double quantity;
    private String unit; // pieces, g, ml, slices, tbsp, cups, handful
}
