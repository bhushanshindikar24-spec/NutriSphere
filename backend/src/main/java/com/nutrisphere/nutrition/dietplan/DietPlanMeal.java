package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "diet_plan_meals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DietPlanMeal extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_plan_id", nullable = false)
    private DietPlan dietPlan;
    @Column(name = "meal_type", nullable = false)
    private String mealType;
    @Column(name = "meal_name")
    private String mealName;
    @Column(name = "scheduled_time")
    private String scheduledTime;
    @Column(name = "day_of_week")
    private String dayOfWeek;
    @Column(name = "notes", length = 500)
    private String notes;
    @Column(name = "sort_order")
    private Integer sortOrder;
}
