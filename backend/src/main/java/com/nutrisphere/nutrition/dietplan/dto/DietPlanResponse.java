package com.nutrisphere.nutrition.dietplan.dto;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class DietPlanResponse {
    private Long id;
    private Long patientUserId;
    private String patientName;
    private Long dietitianUserId;
    private String dietitianName;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private DietPlanStatus status;
    private Double targetCalories;
    private Double targetProteinG;
    private Double targetCarbsG;
    private Double targetFatG;
    private Double targetFiberG;
    private Double targetWaterMl;
    private String notes;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private List<DietPlanMealResponse> meals;
}
