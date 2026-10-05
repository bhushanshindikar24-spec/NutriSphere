package com.nutrisphere.integrations.openfoodfacts;

import com.nutrisphere.nutrition.food.FoodItem;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OpenFoodFactsMapper {

    public FoodItem mapToFoodItem(Map<String, Object> product) {
        if (product == null || product.isEmpty()) return null;

        String name = (String) product.getOrDefault("product_name", product.getOrDefault("product_name_en", "Unknown Product"));
        String brand = (String) product.getOrDefault("brands", "OpenFoodFacts");
        String barcode = String.valueOf(product.getOrDefault("code", product.getOrDefault("_id", "")));
        String imageUrl = (String) product.getOrDefault("image_url", product.getOrDefault("image_front_url", null));

        Double calories = 0.0;
        Double protein = 0.0;
        Double carbs = 0.0;
        Double fat = 0.0;
        Double fiber = 0.0;
        Double sugar = 0.0;
        Double sodium = 0.0;

        Object nutrimentsObj = product.get("nutriments");
        if (nutrimentsObj instanceof Map<?, ?> nutriments) {
            calories = getDouble(nutriments, "energy-kcal_100g", "energy-kcal");
            protein = getDouble(nutriments, "proteins_100g", "proteins");
            carbs = getDouble(nutriments, "carbohydrates_100g", "carbohydrates");
            fat = getDouble(nutriments, "fat_100g", "fat");
            fiber = getDouble(nutriments, "fiber_100g", "fiber");
            sugar = getDouble(nutriments, "sugars_100g", "sugars");
            sodium = getDouble(nutriments, "sodium_100g", "sodium");
            // If sodium is in grams in OFF, convert to mg
            if (sodium != null && sodium > 0 && sodium < 100) {
                sodium = sodium * 1000.0;
            }
        }

        return FoodItem.builder()
                .name(name)
                .brand(brand)
                .category("Packaged Food")
                .servingSizeG(100.0)
                .servingDescription("100g")
                .caloriesPer100g(calories)
                .proteinG(protein)
                .carbsG(carbs)
                .fatG(fat)
                .fiberG(fiber)
                .sugarG(sugar)
                .sodiumMg(sodium)
                .source("OPENFOODFACTS")
                .externalId(barcode)
                .imageUrl(imageUrl)
                .active(true)
                .build();
    }

    private Double getDouble(Map<?, ?> map, String... keys) {
        for (String k : keys) {
            Object val = map.get(k);
            if (val instanceof Number n) {
                return n.doubleValue();
            } else if (val instanceof String s) {
                try {
                    return Double.parseDouble(s);
                } catch (NumberFormatException ignored) {}
            }
        }
        return 0.0;
    }
}
