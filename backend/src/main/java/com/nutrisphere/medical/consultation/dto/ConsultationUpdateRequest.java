package com.nutrisphere.medical.consultation.dto;

import lombok.Data;

@Data
public class ConsultationUpdateRequest {
    private String chiefComplaint;
    private String diagnosis;
    private String treatmentPlan;
    private String notes;
    private java.time.LocalDate followUpDate;
    private String status;
}
