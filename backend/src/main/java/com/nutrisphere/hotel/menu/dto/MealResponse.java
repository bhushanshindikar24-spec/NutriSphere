package com.nutrisphere.hotel.menu.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
@Data
public class MealResponse {
    private Long id;
    private Long hotelUserId;
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
    private String imageUrl;
    private boolean available;

    @JsonProperty("isAvailable")
    public boolean getIsAvailable() {
        return available;
    }
}
