package com.nutrisphere.nutrition.dietplan.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DietPlanRequest {
    @JsonAlias({"patientId", "patient_id"})
    private Long patientUserId;

    @JsonAlias({"name", "planName"})
    private String title;

    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    @JsonAlias({"dailyCaloriesTarget", "caloriesTarget"})
    private Double targetCalories;

    @JsonAlias({"dailyProteinTarget", "proteinTarget"})
    private Double targetProteinG;

    @JsonAlias({"dailyCarbsTarget", "carbsTarget"})
    private Double targetCarbsG;

    @JsonAlias({"dailyFatTarget", "fatTarget"})
    private Double targetFatG;

    @JsonAlias({"dailyFiberTarget", "fiberTarget"})
    private Double targetFiberG;

    @JsonAlias({"dailyWaterTarget", "waterTarget"})
    private Double targetWaterMl;

    private String notes;
    private String status;

    private List<MealItemDto> meals;

    @Data
    public static class MealItemDto {
        private String mealType;
        private String time;
        private Double targetCalories;
        private String description;
        private String dayOfWeek;
    }
}
