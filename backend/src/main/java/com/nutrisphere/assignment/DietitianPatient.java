package com.nutrisphere.assignment;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "dietitian_patient",
    uniqueConstraints = @UniqueConstraint(columnNames = {"dietitian_user_id","patient_user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DietitianPatient extends BaseEntity {
    @Column(name = "dietitian_user_id", nullable = false)
    private Long dietitianUserId;

    @Column(name = "patient_user_id", nullable = false)
    private Long patientUserId;

    @Column(name = "assigned_date")
    private LocalDate assignedDate;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "notes")
    private String notes;
}
