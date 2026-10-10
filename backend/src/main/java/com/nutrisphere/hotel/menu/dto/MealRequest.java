package com.nutrisphere.hotel.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class MealRequest {
    private Long categoryId;
    @NotBlank private String name;
    private String description;
    @PositiveOrZero private Double price;
    @PositiveOrZero private Double calories;
    @PositiveOrZero private Double proteinG;
    @PositiveOrZero private Double carbsG;
    @PositiveOrZero private Double fatG;
    private String allergens;
    private Boolean vegetarian;
    private Boolean vegan;
    @PositiveOrZero private Integer preparationTimeMin;
    private boolean available = true;
}
