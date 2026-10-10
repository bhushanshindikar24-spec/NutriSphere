package com.nutrisphere.admin.dto;

import com.nutrisphere.user.Role;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PendingVerificationDto {
    private Long userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private String status;
    private LocalDateTime registeredAt;

    // Credentials & License Details
    private String licenseNumber;
    private String degree;
    private String specialization;
    private String achievements;
    private String organizationName; // Hospital, Clinic, or Kitchen
    private String organizationAddress;
    private String licenseDocumentUrl;
    private Integer yearsExperience;
    private Double consultationFee;
    private String verificationStatus;
}
