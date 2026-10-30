package com.nutrisphere.patient.dto;

import com.nutrisphere.common.enums.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientProfileRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
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
    private String dietaryPreference;
    private Double currentWaterIntakeLiters;
    private String healthGoals;
    private String nutritionalRequirements;
    private Double targetDailyCalories;
    private Double targetDailyWaterMl;
    private String bloodPressure;
    private Integer restingHeartRate;
    private String diagnosedConditions;
    private String currentSymptoms;
    private String previousSurgeries;
    private String familyMedicalHistory;
    private String currentMedications;
    private String vitaminsSupplements;
    private String foodIntolerances;
    private String mealsPerDay;
    private String mealTimings;
    private String typicalFoodIntake;
    private String exerciseType;
    private String exerciseFrequencyDuration;
    private String smokingTobacco;
    private String alcoholConsumption;
}
