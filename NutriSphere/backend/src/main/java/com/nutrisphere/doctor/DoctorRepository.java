package com.nutrisphere.doctor;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorProfile, Long> {
    @EntityGraph(attributePaths = {"user"})
    Optional<DoctorProfile> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user"})
    List<DoctorProfile> findAll();

    boolean existsByUserId(Long userId);
    List<DoctorProfile> findByVerificationStatus(String verificationStatus);
}
