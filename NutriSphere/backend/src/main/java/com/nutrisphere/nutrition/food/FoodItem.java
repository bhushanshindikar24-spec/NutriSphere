package com.nutrisphere.nutrition.food;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FoodItem extends BaseEntity {
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "brand")
    private String brand;
    @Column(name = "category")
    private String category;
    @Column(name = "serving_size_g")
    private Double servingSizeG;
    @Column(name = "serving_description")
    private String servingDescription;
    @Column(name = "calories_per_100g")
    private Double caloriesPer100g;
    @Column(name = "protein_g")
    private Double proteinG;
    @Column(name = "carbs_g")
    private Double carbsG;
    @Column(name = "fat_g")
    private Double fatG;
    @Column(name = "fiber_g")
    private Double fiberG;
    @Column(name = "sugar_g")
    private Double sugarG;
    @Column(name = "sodium_mg")
    private Double sodiumMg;
    @Column(name = "source")
    @Builder.Default
    private String source = "LOCAL";
    @Column(name = "external_id")
    private String externalId;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;
}
