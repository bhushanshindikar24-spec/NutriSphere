package com.nutrisphere.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    java.util.List<DoctorProfile> findByVerificationStatus(String verificationStatus);
}
