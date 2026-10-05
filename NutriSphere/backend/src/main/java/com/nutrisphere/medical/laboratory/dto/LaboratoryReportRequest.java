package com.nutrisphere.medical.laboratory.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LaboratoryReportRequest {
    private Long patientUserId;
    private LocalDate reportDate;
    private String title;
    private String reportType;
    private String notes;
    private String status;
}
