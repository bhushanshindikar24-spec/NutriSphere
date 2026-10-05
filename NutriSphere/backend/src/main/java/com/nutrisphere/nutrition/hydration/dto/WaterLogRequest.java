package com.nutrisphere.nutrition.hydration.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class WaterLogRequest {
    private LocalDate logDate;
    private LocalTime logTime;
    private Double amountMl;
    private Double amount;
    private String notes;
}
