package com.nutrisphere.hotel.order.dto;
import com.nutrisphere.hotel.order.OrderStatus;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class OrderHistoryResponse {
    private Long orderId;
    private OrderStatus status;
    private String notes;
    private LocalDateTime changedAt;
}
