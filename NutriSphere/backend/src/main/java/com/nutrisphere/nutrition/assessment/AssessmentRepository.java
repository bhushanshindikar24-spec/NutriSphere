package com.nutrisphere.nutrition.assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AssessmentRepository extends JpaRepository<NutritionAssessment, Long> {
    List<NutritionAssessment> findByPatientUserIdOrderByAssessmentDateDesc(Long patientUserId);
    List<NutritionAssessment> findByDietitianUserIdOrderByAssessmentDateDesc(Long dietitianUserId);
}
