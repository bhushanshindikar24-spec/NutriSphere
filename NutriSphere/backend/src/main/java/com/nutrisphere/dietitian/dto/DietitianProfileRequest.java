package com.nutrisphere.dietitian.dto;
import lombok.Data;
@Data
public class DietitianProfileRequest {
    private String specialization;
    private String licenseNumber;
    private String clinicName;
    private String clinicAddress;
    private Integer yearsExperience;
    private String bio;
    private Double consultationFee;
}
