package com.nutrisphere.hotel.category.dto;
import lombok.Data;
@Data
public class CategoryResponse {
    private Long id;
    private Long hotelUserId;
    private String name;
    private String description;
    private Integer sortOrder;
    private boolean active;
}
