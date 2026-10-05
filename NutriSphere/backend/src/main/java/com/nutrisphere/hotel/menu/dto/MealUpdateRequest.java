package com.nutrisphere.hotel.menu.dto;
import lombok.Data;
@Data
public class MealUpdateRequest {
    private String name;
    private String description;
    private Double price;
    private boolean available;
    private Long categoryId;
}
