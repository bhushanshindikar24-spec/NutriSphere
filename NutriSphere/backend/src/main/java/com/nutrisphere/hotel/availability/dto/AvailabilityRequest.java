package com.nutrisphere.hotel.availability.dto;
import lombok.Data;
@Data
public class AvailabilityRequest {
    private Long mealId;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private boolean available;
    private Integer maxOrders;
}
