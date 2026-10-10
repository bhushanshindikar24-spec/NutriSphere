package com.nutrisphere.medical.history;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name = "medical_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalHistory extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "doctor_user_id") private Long doctorUserId;
    @Column(name = "condition_name", nullable = false) private String conditionName;
    @Column(name = "description", length = 1000) private String description;
    @Column(name = "diagnosis_date") private LocalDate diagnosisDate;
    @Column(name = "status") private String status;
    @Column(name = "treatment", length = 500) private String treatment;
    @Column(name = "medications", length = 500) private String medications;
    @Column(name = "is_active") @Builder.Default private boolean active = true;
}
