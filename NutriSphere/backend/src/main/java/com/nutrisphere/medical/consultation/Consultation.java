package com.nutrisphere.medical.consultation;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity 
@Table(name = "consultations")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class Consultation extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) 
    private Long patientUserId;
    
    @Column(name = "doctor_user_id", nullable = false) 
    private Long doctorUserId;
    
    @Column(name = "consultation_date") 
    private LocalDateTime consultationDate;
    
    @Column(name = "chief_complaint", length = 500) 
    private String chiefComplaint;
    
    @Column(name = "diagnosis", length = 500) 
    private String diagnosis;
    
    @Column(name = "icd_code", length = 50)
    private String icdCode;

    @Column(name = "treatment_plan", length = 1000) 
    private String treatmentPlan;

    @Column(name = "clinical_notes", length = 2000) 
    private String clinicalNotes;

    @Column(name = "dietary_directives", length = 2000) 
    private String dietaryDirectives;

    @Column(name = "blood_pressure", length = 50)
    private String bloodPressure;

    @Column(name = "heart_rate", length = 50)
    private String heartRate;

    @Column(name = "notes", length = 2000) 
    private String notes;

    @Column(name = "follow_up_date") 
    private LocalDateTime followUpDate;

    @Column(name = "status") 
    private String status;

    @Transient
    private String patientName;

    @Transient
    private String physicianName;

    @Transient
    private Object vitalSigns;
}
