package com.nutrisphere.nutrition.food.dto;
import lombok.Data;
@Data
public class FoodSearchRequest {
    private String query;
    private String category;
    private String source;
    private int page = 0;
    private int size = 20;
}
