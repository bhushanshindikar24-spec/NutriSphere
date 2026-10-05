package com.nutrisphere.intelligence.adherence.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BarrierResponse {
    private Long id;
    private Long patientUserId;
    private String barrierType;
    private LocalDate barrierDate;
    private String mealType;
    private String description;
    private Long dietPlanMealId;
}
