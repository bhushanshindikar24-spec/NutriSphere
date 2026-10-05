package com.nutrisphere.nutrition.logging.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class PlannedVsActualResponse {
    private LocalDate date;
    private Double plannedCalories;
    private Double actualCalories;
    private Double plannedProteinG;
    private Double actualProteinG;
    private Double plannedCarbsG;
    private Double actualCarbsG;
    private Double plannedFatG;
    private Double actualFatG;
    private double adherencePercent;
}
