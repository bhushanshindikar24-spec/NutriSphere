package com.nutrisphere.hotel.order.dto;
import lombok.Data;
@Data
public class OrderItemRequest {
    private Long mealId;
    private String mealName;
    private Integer quantity;
    private Double unitPrice;
}
