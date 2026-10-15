package com.nutrisphere.assignment.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class AssignmentResponse {
    private Long id;
    private Long patientUserId;
    private String patientName;
    private String patientEmail;
    private Long doctorUserId;
    private String doctorName;
    private String doctorSpecialization;
    private Long dietitianUserId;
    private String dietitianName;
    private LocalDate assignedDate;
    private boolean active;
    private String notes;
    private Integer age;
    private String gender;
    private Double weightKg;
    private Double heightCm;
    private String activeCondition;
    private String assignedDietitian;
    private String assignedDoctor;
    private String status;
}
