package com.nutrisphere.patient.dto;

import com.nutrisphere.common.enums.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PatientProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private String profileImageUrl;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String bloodType;
    private ActivityLevel activityLevel;
    private String allergies;
    private String dietaryRestrictions;
    private String foodPreferences;
    private String occupation;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private Integer age;
    private String bloodGroup;
    private String assignedDietitian;
    private String assignedDoctor;
    private String activeCondition;
    private String status;
    private String dietaryPreference;
    private Double currentWaterIntakeLiters;
    private String healthGoals;
    private String nutritionalRequirements;
    private Double targetDailyCalories;
    private Double targetDailyWaterMl;
    private Double bmr;
    private Double tdee;
    private Double recommendedCalories;
    private Double recommendedWaterLiters;
    private LocalDateTime createdAt;
}
