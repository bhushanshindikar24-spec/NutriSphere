package com.nutrisphere.hotel.order.dto;
import com.nutrisphere.hotel.order.OrderStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class OrderResponse {
    private Long id;
    private Long patientUserId;
    private Long hotelUserId;
    private OrderStatus status;
    private Double totalAmount;
    private String deliveryAddress;
    private String specialInstructions;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long mealId;
        private String mealName;
        private Integer quantity;
        private Double unitPrice;
        private Double totalPrice;
    }
}
