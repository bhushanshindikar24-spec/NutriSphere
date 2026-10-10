package com.nutrisphere.medical.condition;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "patient_conditions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientCondition extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "condition_id") private Long conditionId;
    @Column(name = "condition_name", nullable = false) private String conditionName;
    @Column(name = "diagnosed_date") private LocalDate diagnosedDate;
    @Column(name = "severity") private String severity;
    @Column(name = "notes", length = 500) private String notes;
    @Column(name = "is_active") @Builder.Default private boolean active = true;
}
