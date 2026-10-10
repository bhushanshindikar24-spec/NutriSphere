package com.nutrisphere.doctor.dto;

import lombok.Data;

@Data
public class DoctorProfileRequest {
    private String specialization;
    private String licenseNumber;
    private String hospitalName;
    private String hospitalAddress;
    private Integer yearsExperience;
    private String bio;
    private Double consultationFee;
}
