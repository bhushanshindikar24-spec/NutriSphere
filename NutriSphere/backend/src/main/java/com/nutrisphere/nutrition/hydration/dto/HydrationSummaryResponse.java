package com.nutrisphere.nutrition.hydration.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class HydrationSummaryResponse {
    private LocalDate date;
    private double totalMl;
    private double targetMl;
    private double percentComplete;
    private int logCount;
}
