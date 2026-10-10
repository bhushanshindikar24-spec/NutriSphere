package com.nutrisphere.medical.laboratory.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LaboratoryReportResponse {
    private Long id;
    private Long patientUserId;
    private Long doctorUserId;
    private LocalDate reportDate;
    private String title;
    private String reportType;
    private String notes;
    private String filePath;
    private String fileName;
    private String status;
    private LocalDateTime createdAt;
    private List<LaboratoryValueResponse> values;
}
