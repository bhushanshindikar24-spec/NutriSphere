package com.nutrisphere.medical.condition.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientConditionResponse {
    private Long id;
    private Long patientUserId;
    private Long conditionId;
    private String conditionName;
    private LocalDate diagnosedDate;
    private String severity;
    private String notes;
    private boolean active;
}
