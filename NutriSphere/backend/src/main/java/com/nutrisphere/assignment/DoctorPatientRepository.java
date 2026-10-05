package com.nutrisphere.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorPatientRepository extends JpaRepository<DoctorPatient, Long> {
    List<DoctorPatient> findByDoctorUserIdAndActiveTrue(Long doctorUserId);
    List<DoctorPatient> findByPatientUserIdAndActiveTrue(Long patientUserId);
    Optional<DoctorPatient> findByDoctorUserIdAndPatientUserId(Long doctorId, Long patientId);
    long countByDoctorUserId(Long doctorUserId);
    boolean existsByDoctorUserIdAndPatientUserId(Long doctorId, Long patientId);
}
