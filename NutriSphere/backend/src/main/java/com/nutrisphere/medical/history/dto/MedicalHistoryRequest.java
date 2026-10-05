package com.nutrisphere.medical.history.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicalHistoryRequest {
    private Long patientUserId;
    private String conditionName;
    private String description;
    private LocalDate diagnosisDate;
    private String status;
    private String treatment;
    private String medications;
    private boolean active = true;
}
