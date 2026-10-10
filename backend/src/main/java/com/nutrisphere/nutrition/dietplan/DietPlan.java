package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "diet_plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DietPlan extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false)
    private Long patientUserId;
    @Column(name = "dietitian_user_id", nullable = false)
    private Long dietitianUserId;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(name = "description", length = 1000)
    private String description;
    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private DietPlanStatus status = DietPlanStatus.DRAFT;
    @Column(name = "target_calories")
    private Double targetCalories;
    @Column(name = "target_protein_g")
    private Double targetProteinG;
    @Column(name = "target_carbs_g")
    private Double targetCarbsG;
    @Column(name = "target_fat_g")
    private Double targetFatG;
    @Column(name = "target_fiber_g")
    private Double targetFiberG;
    @Column(name = "target_water_ml")
    private Double targetWaterMl;
    @Column(name = "notes", length = 2000)
    private String notes;
    @Column(name = "approved_at")
    private java.time.LocalDateTime approvedAt;
}
