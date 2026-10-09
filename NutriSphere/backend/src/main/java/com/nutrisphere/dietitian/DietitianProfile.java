package com.nutrisphere.dietitian;

import com.nutrisphere.common.BaseEntity;
import com.nutrisphere.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dietitian_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DietitianProfile extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "license_number", unique = true)
    private String licenseNumber;

    @Column(name = "clinic_name")
    private String clinicName;

    @Column(name = "clinic_address")
    private String clinicAddress;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "degree")
    private String degree;

    @Column(name = "achievements", length = 1000)
    private String achievements;

    @Column(name = "license_document_url", length = 500)
    private String licenseDocumentUrl;

    @Column(name = "verification_status")
    @Builder.Default
    private String verificationStatus = "APPROVED";

    @Column(name = "consultation_fee")
    private Double consultationFee;
}
