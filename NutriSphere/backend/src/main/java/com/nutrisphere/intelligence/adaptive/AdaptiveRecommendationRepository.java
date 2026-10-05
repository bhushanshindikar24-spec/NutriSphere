package com.nutrisphere.intelligence.adaptive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AdaptiveRecommendationRepository extends JpaRepository<AdaptiveRecommendation, Long> {
    List<AdaptiveRecommendation> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId);
    List<AdaptiveRecommendation> findByPatientUserIdAndStatus(Long patientUserId, AdaptiveRecommendationStatus status);
    List<AdaptiveRecommendation> findByDietPlanIdOrderByCreatedAtDesc(Long dietPlanId);
}
