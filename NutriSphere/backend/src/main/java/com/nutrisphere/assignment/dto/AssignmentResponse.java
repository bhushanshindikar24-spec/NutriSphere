package com.nutrisphere.assignment.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class AssignmentResponse {
    private Long id;
    private Long patientUserId;
    private String patientName;
    private String patientEmail;
    private LocalDate assignedDate;
    private boolean active;
    private String notes;
}
