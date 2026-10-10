package com.nutrisphere.assignment;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "doctor_patient",
    uniqueConstraints = @UniqueConstraint(columnNames = {"doctor_user_id","patient_user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorPatient extends BaseEntity {
    @Column(name = "doctor_user_id", nullable = false)
    private Long doctorUserId;

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
