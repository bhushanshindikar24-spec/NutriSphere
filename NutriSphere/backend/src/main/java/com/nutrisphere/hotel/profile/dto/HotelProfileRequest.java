package com.nutrisphere.hotel.profile.dto;
import lombok.Data;
@Data
public class HotelProfileRequest {
    private String hotelName;
    private String hotelAddress;
    private String phoneNumber;
    private String description;
    private String cuisineType;
}
