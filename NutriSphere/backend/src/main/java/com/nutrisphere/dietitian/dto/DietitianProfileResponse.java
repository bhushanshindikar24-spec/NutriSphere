package com.nutrisphere.dietitian.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class DietitianProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private String profileImageUrl;
    private String specialization;
    private String licenseNumber;
    private String clinicName;
    private String clinicAddress;
    private Integer yearsExperience;
    private String bio;
    private Double consultationFee;
    private LocalDateTime createdAt;
}
