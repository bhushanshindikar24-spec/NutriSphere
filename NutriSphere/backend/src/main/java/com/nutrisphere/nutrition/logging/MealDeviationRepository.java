package com.nutrisphere.nutrition.logging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealDeviationRepository extends JpaRepository<MealDeviation, Long> {
    List<MealDeviation> findByPatientUserIdOrderByDeviationDateDesc(Long patientUserId);
    List<MealDeviation> findByPatientUserIdAndDeviationDateBetween(Long patientUserId, LocalDate from, LocalDate to);
}
