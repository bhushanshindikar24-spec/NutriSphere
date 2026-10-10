package com.nutrisphere.hotel.order.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OrderItemRequest {
    @NotNull private Long mealId;
    private String mealName;
    @Positive private Integer quantity = 1;

    @JsonAlias({"price", "unit_price"})
    private Double unitPrice;
}
