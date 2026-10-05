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
    @Column(name = "is_active") @Builder.Default private boolean active = true;
}
