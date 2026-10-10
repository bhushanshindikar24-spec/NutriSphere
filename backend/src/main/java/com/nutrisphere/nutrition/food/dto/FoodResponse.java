package com.nutrisphere.nutrition.food.dto;
import lombok.Data;
@Data
public class FoodResponse {
    private Long id;
    private String name;
    private String brand;
    private String category;
    private Double servingSizeG;
    private String servingDescription;
    private Double caloriesPer100g;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;
    private Double fiberG;
    private Double sugarG;
    private Double sodiumMg;
    private String source;
    private String externalId;
    private String imageUrl;
}
