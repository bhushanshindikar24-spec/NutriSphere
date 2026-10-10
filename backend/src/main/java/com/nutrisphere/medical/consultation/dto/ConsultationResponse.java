package com.nutrisphere.medical.consultation.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ConsultationResponse {
    private Long id;
    private Long patientUserId;
    private Long doctorUserId;
    private LocalDate consultationDate;
    private String chiefComplaint;
    private String diagnosis;
    private String treatmentPlan;
    private String notes;
    private LocalDate followUpDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
