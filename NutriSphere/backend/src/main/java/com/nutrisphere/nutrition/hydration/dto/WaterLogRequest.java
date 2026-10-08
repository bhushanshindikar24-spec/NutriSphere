package com.nutrisphere.nutrition.hydration.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class WaterLogRequest {
    @NotNull private LocalDate logDate;
    private LocalTime logTime;
    @Positive private Double amountMl;
    @Positive private Double amount;
    private String notes;
}
