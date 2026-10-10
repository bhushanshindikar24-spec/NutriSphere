package com.nutrisphere.medical.report.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MedicalReportResponse {
    private Long id;
    private Long patientUserId;
    private Long uploadedByUserId;
    private LocalDate reportDate;
    private String title;
    private String reportType;
    private String description;
    private String notes;
    private String filePath;
    private String fileName;
    private Long fileSize;
    private LocalDateTime createdAt;
}
