package com.nutrisphere.hotel.category.dto;
import lombok.Data;
@Data
public class CategoryRequest {
    private String name;
    private String description;
    private Integer sortOrder;
}
