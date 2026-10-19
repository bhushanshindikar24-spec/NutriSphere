package com.nutrisphere.nutrition.logging.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealBuilderRequest {
    private String mealName; // e.g. "Paneer Sandwich"
    private String mealType; // BREAKFAST, LUNCH, DINNER, SNACK
    private LocalDate logDate;
    private String notes;
    private List<IngredientItem> ingredients;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IngredientItem {
        private Long foodItemId;
        private String foodName;
        private Double quantity;
        private String unit; // g, pieces, ml, slices, tbsp
        private Double calories;
        private Double proteinG;
        private Double carbsG;
        private Double fatG;
        private Double fiberG;
    }
}
