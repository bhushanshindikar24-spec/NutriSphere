package com.nutrisphere.patient.dto;

import com.nutrisphere.common.enums.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientProfileRequest {
    private LocalDate dateOfBirth;
    private Gender gender;
    private Double heightCm;
    private Double weightKg;
    private String bloodType;
    private ActivityLevel activityLevel;
    private String allergies;
    private String dietaryRestrictions;
    private String foodPreferences;
    private String occupation;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
