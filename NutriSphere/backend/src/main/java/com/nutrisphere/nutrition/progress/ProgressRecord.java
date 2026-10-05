package com.nutrisphere.nutrition.progress;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name = "progress_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProgressRecord extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "record_date") private LocalDate recordDate;
    @Column(name = "notes", length = 500) private String notes;
    @Column(name = "adherence_percent") private Double adherencePercent;
    @Column(name = "calories_consumed") private Double caloriesConsumed;
    @Column(name = "water_consumed_ml") private Double waterConsumedMl;
}
