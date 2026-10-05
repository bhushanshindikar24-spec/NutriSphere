package com.nutrisphere.hotel.availability.dto;
import lombok.Data;
@Data
public class AvailabilityResponse {
    private Long id;
    private Long mealId;
    private Long hotelUserId;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private boolean available;
    private Integer maxOrders;
}
