package com.nutrisphere.medical.history.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MedicalHistoryResponse {
    private Long id;
    private Long patientUserId;
    private Long doctorUserId;
    private String conditionName;
    private String description;
    private LocalDate diagnosisDate;
    private String status;
    private String treatment;
    private String medications;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
