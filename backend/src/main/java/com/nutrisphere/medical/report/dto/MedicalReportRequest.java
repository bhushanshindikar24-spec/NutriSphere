package com.nutrisphere.medical.report.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicalReportRequest {
    private Long patientUserId;
    private LocalDate reportDate;
    private String title;
    private String reportType;
    private String description;
    private String notes;
}
