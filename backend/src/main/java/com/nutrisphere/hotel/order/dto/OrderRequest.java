package com.nutrisphere.hotel.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long hotelUserId;
    @NotBlank private String deliveryAddress;
    @com.fasterxml.jackson.annotation.JsonAlias({"notes", "deliveryNotes"})
    private String specialInstructions;
    @NotEmpty @Valid private List<OrderItemRequest> items;
}
