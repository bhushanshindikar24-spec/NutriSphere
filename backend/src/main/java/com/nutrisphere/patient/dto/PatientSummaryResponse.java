package com.nutrisphere.patient.dto;

import lombok.Data;

@Data
public class PatientSummaryResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private Double weightKg;
    private Double heightCm;
    private String assignmentDate;
}
