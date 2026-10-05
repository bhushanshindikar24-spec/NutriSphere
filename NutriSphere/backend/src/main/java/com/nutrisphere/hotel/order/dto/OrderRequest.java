package com.nutrisphere.hotel.order.dto;
import lombok.Data;
import java.util.List;
@Data
public class OrderRequest {
    private Long hotelUserId;
    private String deliveryAddress;
    private String specialInstructions;
    private List<OrderItemRequest> items;
}
