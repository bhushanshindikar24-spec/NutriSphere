package com.nutrisphere.integrations.fooddata;

import com.nutrisphere.nutrition.food.FoodItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class FoodDataMapper {

    public FoodItem mapToFoodItem(Map<String, Object> food) {
        if (food == null || food.isEmpty()) return null;

        String description = (String) food.getOrDefault("description", "Unknown Food");
        String brandName = (String) food.getOrDefault("brandName", food.getOrDefault("brandOwner", "USDA FoodData"));
        String fdcId = String.valueOf(food.getOrDefault("fdcId", ""));

        Double calories = 0.0;
        Double protein = 0.0;
        Double carbs = 0.0;
        Double fat = 0.0;
        Double fiber = 0.0;
        Double sugar = 0.0;
        Double sodium = 0.0;

        Object nutrientsObj = food.get("foodNutrients");
        if (nutrientsObj instanceof List<?> nutrients) {
            for (Object n : nutrients) {
                if (n instanceof Map<?, ?> nutrientMap) {
                    String nutrientName = String.valueOf(nutrientMap.get("nutrientName")).toLowerCase();
                    Double value = 0.0;
                    Object valObj = nutrientMap.get("value");
                    if (valObj instanceof Number num) {
                        value = num.doubleValue();
                    }

                    if (nutrientName.contains("energy") || nutrientName.contains("calorie")) {
                        calories = value;
                    } else if (nutrientName.contains("protein")) {
                        protein = value;
                    } else if (nutrientName.contains("carbohydrate")) {
                        carbs = value;
                    } else if (nutrientName.contains("total lipid") || nutrientName.contains("fat")) {
                        fat = value;
                    } else if (nutrientName.contains("fiber")) {
                        fiber = value;
                    } else if (nutrientName.contains("sugars")) {
                        sugar = value;
                    } else if (nutrientName.contains("sodium")) {
                        sodium = value;
                    }
                }
            }
        }

        return FoodItem.builder()
                .name(description)
                .brand(brandName)
                .category("USDA Database")
                .servingSizeG(100.0)
                .servingDescription("100g")
                .caloriesPer100g(calories)
                .proteinG(protein)
                .carbsG(carbs)
                .fatG(fat)
                .fiberG(fiber)
                .sugarG(sugar)
                .sodiumMg(sodium)
                .source("USDA")
                .externalId(fdcId)
                .active(true)
                .build();
    }
}
