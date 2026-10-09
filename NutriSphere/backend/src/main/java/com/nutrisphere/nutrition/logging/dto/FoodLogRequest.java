package com.nutrisphere.nutrition.logging.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class FoodLogRequest {
    private Long foodItemId;
    @NotBlank private String foodName;
    
    private LocalDate logDate = LocalDate.now();
    private LocalTime logTime = LocalTime.now();
    private String mealType = "BREAKFAST";
    
    @PositiveOrZero private Double quantityG;
    @PositiveOrZero private Double calories;

    @JsonAlias({"protein", "protein_g"})
    @PositiveOrZero private Double proteinG;

    @JsonAlias({"carbs", "carbs_g"})
    @PositiveOrZero private Double carbsG;

    @JsonAlias({"fat", "fat_g"})
    @PositiveOrZero private Double fatG;

    @JsonAlias({"fiber", "fiber_g"})
    @PositiveOrZero private Double fiberG;

    private String notes;
    private Long dietPlanMealId;

    public LocalDate getLogDate() {
        return logDate != null ? logDate : LocalDate.now();
    }
}
