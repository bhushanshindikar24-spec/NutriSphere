package com.nutrisphere.intelligence.digitaltwin;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "nutrition_digital_twin")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NutritionDigitalTwin extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false, unique = true) private Long patientUserId;
    @Column(name = "snapshot_json", columnDefinition = "TEXT") private String snapshotJson;
    @Column(name = "last_updated") private java.time.LocalDateTime lastUpdated;
}
