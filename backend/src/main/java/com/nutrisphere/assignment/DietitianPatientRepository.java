package com.nutrisphere.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DietitianPatientRepository extends JpaRepository<DietitianPatient, Long> {
    List<DietitianPatient> findByDietitianUserIdAndActiveTrue(Long dietitianUserId);
    List<DietitianPatient> findByPatientUserIdAndActiveTrue(Long patientUserId);
    Optional<DietitianPatient> findByDietitianUserIdAndPatientUserId(Long dietitianId, Long patientId);
    long countByDietitianUserId(Long dietitianUserId);
    boolean existsByDietitianUserIdAndPatientUserId(Long dietitianId, Long patientId);
}
