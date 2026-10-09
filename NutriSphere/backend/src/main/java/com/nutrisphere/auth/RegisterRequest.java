package com.nutrisphere.auth;

import com.nutrisphere.user.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String password;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    private String phoneNumber;

    // Optional Role for Registration (PATIENT, DOCTOR, DIETITIAN, HOTEL)
    private Role role;

    // Professional / License Details (Required for DOCTOR, DIETITIAN, HOTEL)
    private String licenseNumber;
    private String degree;
    private String specialization;
    private String achievements;
    private String hospitalOrClinic;
    private String licenseDocumentUrl;
    private Integer yearsExperience;
    private Double consultationFee;
    private String cuisineType;
    private String address;
}
