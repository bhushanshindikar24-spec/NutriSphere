package com.nutrisphere.nutrition.hydration.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class WaterLogRequest {
    private LocalDate logDate = LocalDate.now();
    private LocalTime logTime = LocalTime.now();

    @JsonAlias({"amount", "waterAmount", "ml"})
    private Double amountMl;

    private String notes;

    public LocalDate getLogDate() {
        return logDate != null ? logDate : LocalDate.now();
    }

    public Double getAmountMl() {
        return amountMl != null ? amountMl : 250.0;
    }

    public Double getAmount() {
        return getAmountMl();
    }
}
