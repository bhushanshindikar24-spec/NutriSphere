package com.nutrisphere.nutrition.logging.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class FoodLogResponse {
    private Long id;
    private Long patientUserId;
    private Long foodItemId;
    private String foodName;
    private LocalDate logDate;
    private LocalTime logTime;
    private String mealType;
    private Double quantityG;
    private Double calories;
    private Double proteinG;
    private Double carbsG;
    private Double fatG;
    private Double fiberG;
    private String notes;
}
