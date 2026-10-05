package com.nutrisphere.nutrition.food.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class FoodRequest {
    @NotBlank private String name;
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
}
