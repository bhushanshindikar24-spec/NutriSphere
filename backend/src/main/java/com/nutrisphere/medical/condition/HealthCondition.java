package com.nutrisphere.medical.condition;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "health_conditions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HealthCondition extends BaseEntity {
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "description", length = 500) private String description;
    @Column(name = "category") private String category;
    @Column(name = "icd_code") private String icdCode;
    @Column(name = "dietary_restrictions", length = 1000) private String dietaryRestrictions;
    @Column(name = "foods_to_avoid", length = 1000) private String foodsToAvoid;
    @Column(name = "recommended_foods", length = 1000) private String recommendedFoods;
    @Column(name = "recommended_alternatives", length = 1000) private String recommendedAlternatives;
    @Column(name = "clinical_guidelines", length = 1000) private String clinicalGuidelines;
    @Column(name = "is_active") @Builder.Default private boolean active = true;
}
