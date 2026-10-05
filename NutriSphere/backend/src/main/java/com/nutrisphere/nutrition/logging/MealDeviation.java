package com.nutrisphere.nutrition.logging;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "meal_deviations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MealDeviation extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false)
    private Long patientUserId;
    @Column(name = "diet_plan_meal_id")
    private Long dietPlanMealId;
    @Column(name = "deviation_date")
    private LocalDate deviationDate;
    @Column(name = "reason", length = 500)
    private String reason;
    @Column(name = "actual_food", length = 500)
    private String actualFood;
    @Column(name = "notes", length = 500)
    private String notes;
}
