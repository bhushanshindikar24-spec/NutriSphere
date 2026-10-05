package com.nutrisphere.hotel.menu.dto;
import lombok.Data;
@Data
public class MealRequest {
    private Long categoryId;
    private String name;
    private String description;
    private Double price;
    private Double calories;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;
    private String allergens;
    private Boolean vegetarian;
    private Boolean vegan;
    private Integer preparationTimeMin;
    private boolean available = true;
}
