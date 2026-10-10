package com.nutrisphere.nutrition.assessment;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "nutrition_assessments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NutritionAssessment extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "dietitian_user_id", nullable = false) private Long dietitianUserId;
    @Column(name = "assessment_date") private java.time.LocalDate assessmentDate;
    @Column(name = "weight_kg") private Double weightKg;
    @Column(name = "height_cm") private Double heightCm;
    @Column(name = "bmi") private Double bmi;
    @Column(name = "body_fat_percent") private Double bodyFatPercent;
    @Column(name = "muscle_mass_kg") private Double muscleMassKg;
    @Column(name = "waist_cm") private Double waistCm;
    @Column(name = "hip_cm") private Double hipCm;
    @Column(name = "chief_complaint", length = 500) private String chiefComplaint;
    @Column(name = "dietary_habits", length = 1000) private String dietaryHabits;
    @Column(name = "food_allergies", length = 500) private String foodAllergies;
    @Column(name = "supplements", length = 500) private String supplements;
    @Column(name = "notes", length = 2000) private String notes;
}
