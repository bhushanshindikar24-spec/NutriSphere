package com.nutrisphere.medical.consultation.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ConsultationRequest {
    private Long patientUserId;
    private LocalDate consultationDate;
    private String chiefComplaint;
    private String diagnosis;
    private String treatmentPlan;
    private String notes;
    private LocalDate followUpDate;
    private String status;
}
