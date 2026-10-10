package com.nutrisphere.nutrition.progress;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name = "patient_measurements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientMeasurement extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "measured_by_user_id") private Long measuredByUserId;
    @Column(name = "measurement_date", nullable = false) private LocalDate measurementDate;
    @Column(name = "weight_kg") private Double weightKg;
    @Column(name = "height_cm") private Double heightCm;
    @Column(name = "bmi") private Double bmi;
    @Column(name = "waist_cm") private Double waistCm;
    @Column(name = "hip_cm") private Double hipCm;
    @Column(name = "body_fat_percent") private Double bodyFatPercent;
    @Column(name = "muscle_mass_kg") private Double muscleMassKg;
    @Column(name = "notes") private String notes;
}
