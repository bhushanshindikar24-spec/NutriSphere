package com.nutrisphere.hotel.menu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MealRequest {
    private Long categoryId;
    private String category;
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
    private String imageUrl;
    private Object ingredients;
    private boolean available = true;

    @JsonProperty("isAvailable")
    public void setIsAvailable(Boolean isAvailable) {
        if (isAvailable != null) {
            this.available = isAvailable;
        }
    }
}
