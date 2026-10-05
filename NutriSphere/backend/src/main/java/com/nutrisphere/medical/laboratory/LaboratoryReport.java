package com.nutrisphere.medical.laboratory;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "laboratory_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LaboratoryReport extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "doctor_user_id") private Long doctorUserId;
    @Column(name = "report_date") private LocalDate reportDate;
    @Column(name = "title", nullable = false) private String title;
    @Column(name = "report_type") private String reportType;
    @Column(name = "notes", length = 1000) private String notes;
    @Column(name = "file_path") private String filePath;
    @Column(name = "file_name") private String fileName;
    @Column(name = "file_size") private Long fileSize;
    @Column(name = "status") private String status;
}
