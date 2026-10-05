package com.nutrisphere.intelligence.adherence;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name = "adherence_barriers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdherenceBarrier extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "barrier_type", nullable = false) private String barrierType;
    @Column(name = "barrier_date") private LocalDate barrierDate;
    @Column(name = "meal_type") private String mealType;
    @Column(name = "diet_plan_meal_id") private Long dietPlanMealId;
    @Column(name = "description", length = 500) private String description;
}
