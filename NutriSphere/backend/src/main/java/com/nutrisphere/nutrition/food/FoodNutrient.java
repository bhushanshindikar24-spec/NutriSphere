package com.nutrisphere.nutrition.food;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_nutrients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FoodNutrient extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_item_id")
    private FoodItem foodItem;
    @Column(name = "nutrient_name")
    private String nutrientName;
    @Column(name = "nutrient_value")
    private Double nutrientValue;
    @Column(name = "unit")
    private String unit;
}
