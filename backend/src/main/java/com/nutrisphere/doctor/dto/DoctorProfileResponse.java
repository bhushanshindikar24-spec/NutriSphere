package com.nutrisphere.doctor.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DoctorProfileResponse {
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
    private String hospitalName;
    private String hospitalAddress;
    private Integer yearsExperience;
    private String bio;
    private Double consultationFee;
    private String degree;
    private String achievements;
    private String licenseDocumentUrl;
    private String verificationStatus;
    private LocalDateTime createdAt;
}
