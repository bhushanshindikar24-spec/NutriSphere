package com.nutrisphere.nutrition.progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface MeasurementRepository extends JpaRepository<PatientMeasurement, Long> {
    List<PatientMeasurement> findByPatientUserIdOrderByMeasurementDateDesc(Long patientUserId);
}
