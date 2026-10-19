package com.nutrisphere.patient;

import com.nutrisphere.common.BaseEntity;
import com.nutrisphere.common.enums.*;
import com.nutrisphere.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "patient_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientProfile extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "blood_type")
    private String bloodType;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level")
    private ActivityLevel activityLevel;

    @Column(name = "allergies", length = 500)
    private String allergies;

    @Column(name = "dietary_restrictions", length = 500)
    private String dietaryRestrictions;

    @Column(name = "food_preferences", length = 500)
    private String foodPreferences;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "address")
    private String address;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "dietary_preference", length = 100)
    private String dietaryPreference;

    @Column(name = "current_water_intake_liters")
    private Double currentWaterIntakeLiters;

    @Column(name = "health_goals", length = 500)
    private String healthGoals;

    @Column(name = "nutritional_requirements", length = 1000)
    private String nutritionalRequirements;

    @Column(name = "target_daily_calories")
    private Double targetDailyCalories;

    @Column(name = "target_daily_water_ml")
    private Double targetDailyWaterMl;
}
