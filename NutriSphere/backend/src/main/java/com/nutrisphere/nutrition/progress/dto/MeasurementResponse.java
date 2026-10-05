package com.nutrisphere.nutrition.progress.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class MeasurementResponse {
    private Long id;
    private Long patientUserId;
    private LocalDate measurementDate;
    private Double weightKg;
    private Double heightCm;
    private Double bmi;
    private Double waistCm;
    private Double hipCm;
    private Double bodyFatPercent;
    private Double muscleMassKg;
    private String notes;
}
