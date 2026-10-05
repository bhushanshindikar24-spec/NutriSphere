package com.nutrisphere.nutrition.assessment.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class AssessmentRequest {
    private Long patientUserId;
    private Long patientId;
    private LocalDate assessmentDate;
    private String assessmentType;
    private Double weightKg;
    private Double heightCm;
    private Double bmi;
    private Double bodyFatPercent;
    private Double muscleMassKg;
    private Double waistCm;
    private Double hipCm;
    private String chiefComplaint;
    private String clinicalDiagnosis;
    private String dietaryHabits;
    private String dietaryHistory;
    private String foodAllergies;
    private String supplements;
    private String notes;
    private String recommendations;
}
