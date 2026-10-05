package com.nutrisphere.intelligence.digitaltwin;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DigitalTwinRepository extends JpaRepository<NutritionDigitalTwin, Long> {
    Optional<NutritionDigitalTwin> findByPatientUserId(Long patientUserId);
}
