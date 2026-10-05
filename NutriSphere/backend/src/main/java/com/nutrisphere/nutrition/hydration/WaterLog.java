package com.nutrisphere.nutrition.hydration;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
@Entity @Table(name = "water_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WaterLog extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "log_date", nullable = false) private LocalDate logDate;
    @Column(name = "log_time") private LocalTime logTime;
    @Column(name = "amount_ml", nullable = false) private Double amountMl;
    @Column(name = "notes") private String notes;
}
