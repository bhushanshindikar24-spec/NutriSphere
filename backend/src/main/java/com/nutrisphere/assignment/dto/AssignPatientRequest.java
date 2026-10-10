package com.nutrisphere.assignment.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class AssignPatientRequest {
    @NotNull
    private Long patientUserId;
    private String notes;
}
