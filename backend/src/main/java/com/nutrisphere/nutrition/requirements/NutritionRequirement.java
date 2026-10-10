package com.nutrisphere.nutrition.requirements;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "nutrition_requirements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NutritionRequirement extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "dietitian_user_id") private Long dietitianUserId;
    @Column(name = "calories_target") private Double caloriesTarget;
    @Column(name = "protein_g_target") private Double proteinGTarget;
    @Column(name = "carbs_g_target") private Double carbsGTarget;
    @Column(name = "fat_g_target") private Double fatGTarget;
    @Column(name = "fiber_g_target") private Double fiberGTarget;
    @Column(name = "water_ml_target") private Double waterMlTarget;
    @Column(name = "calculation_method") private String calculationMethod;
    @Column(name = "notes", length = 500) private String notes;
    @Column(name = "is_active") @Builder.Default private boolean active = true;
}
