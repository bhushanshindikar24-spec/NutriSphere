package com.nutrisphere.nutrition.logging;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity @Table(name = "food_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FoodLog extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false)
    private Long patientUserId;
    @Column(name = "food_item_id")
    private Long foodItemId;
    @Column(name = "food_name", nullable = false)
    private String foodName;
    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;
    @Column(name = "log_time")
    private LocalTime logTime;
    @Column(name = "meal_type")
    private String mealType;
    @Column(name = "quantity_g")
    private Double quantityG;
    @Column(name = "calories")
    private Double calories;
    @Column(name = "protein_g")
    private Double proteinG;
    @Column(name = "carbs_g")
    private Double carbsG;
    @Column(name = "fat_g")
    private Double fatG;
    @Column(name = "fiber_g")
    private Double fiberG;
    @Column(name = "notes")
    private String notes;
    @Column(name = "diet_plan_meal_id")
    private Long dietPlanMealId;
}
