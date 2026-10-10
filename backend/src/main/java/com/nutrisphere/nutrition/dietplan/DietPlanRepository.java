package com.nutrisphere.nutrition.dietplan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId);
    List<DietPlan> findByDietitianUserIdOrderByCreatedAtDesc(Long dietitianUserId);
    Optional<DietPlan> findByPatientUserIdAndStatus(Long patientUserId, DietPlanStatus status);
    List<DietPlan> findByPatientUserIdAndStatusIn(Long patientUserId, List<DietPlanStatus> statuses);
}
