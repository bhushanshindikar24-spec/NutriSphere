package com.nutrisphere.hotel.profile.dto;
import lombok.Data;
@Data
public class HotelProfileResponse {
    private Long id;
    private Long userId;
    private String hotelName;
    private String hotelAddress;
    private String phoneNumber;
    private String description;
    private String cuisineType;
    private boolean active;
}
