package com.nutrisphere.medical.report;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name = "medical_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalReport extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "uploaded_by_user_id") private Long uploadedByUserId;
    @Column(name = "title", nullable = false) private String title;
    @Column(name = "report_type") private String reportType;
    @Column(name = "report_date") private LocalDate reportDate;
    @Column(name = "file_path") private String filePath;
    @Column(name = "file_name") private String fileName;
    @Column(name = "file_size") private Long fileSize;
    @Column(name = "description", length = 500) private String description;
    @Column(name = "notes", length = 500) private String notes;
}
