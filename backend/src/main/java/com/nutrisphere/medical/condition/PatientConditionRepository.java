package com.nutrisphere.medical.condition;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PatientConditionRepository extends JpaRepository<PatientCondition, Long> {
    List<PatientCondition> findByPatientUserId(Long patientUserId);
    List<PatientCondition> findByPatientUserIdAndActiveTrue(Long patientUserId);
}
