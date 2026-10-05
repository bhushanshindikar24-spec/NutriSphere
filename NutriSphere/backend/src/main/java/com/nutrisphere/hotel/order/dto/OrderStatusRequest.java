package com.nutrisphere.hotel.order.dto;
import com.nutrisphere.hotel.order.OrderStatus;
import lombok.Data;
@Data
public class OrderStatusRequest {
    private OrderStatus status;
    private String notes;
}
