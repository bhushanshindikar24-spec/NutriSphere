package com.nutrisphere.nutrition.progress.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class ProgressRequest {
    private LocalDate recordDate;
    private String notes;
    private Double adherencePercent;
    private Double caloriesConsumed;
    private Double waterConsumedMl;
}
