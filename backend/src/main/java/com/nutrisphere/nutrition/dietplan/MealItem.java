package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meal_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MealItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_plan_meal_id", nullable = false)
    private DietPlanMeal dietPlanMeal;
    @Column(name = "food_item_id")
    private Long foodItemId;
    @Column(name = "food_name", nullable = false)
    private String foodName;
    @Column(name = "quantity_g")
    private Double quantityG;
    @Column(name = "serving_description")
    private String servingDescription;
    @Column(name = "calories")
    private Double calories;
    @Column(name = "protein_g")
    private Double proteinG;
    @Column(name = "carbs_g")
    private Double carbsG;
    @Column(name = "fat_g")
    private Double fatG;
    @Column(name = "notes")
    private String notes;
}
