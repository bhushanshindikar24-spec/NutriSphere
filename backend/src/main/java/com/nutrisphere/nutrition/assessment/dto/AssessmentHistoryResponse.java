package com.nutrisphere.nutrition.assessment.dto;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
@Data
public class AssessmentHistoryResponse {
    private Long patientUserId;
    private int count;
    private List<AssessmentResponse> assessments;
}
