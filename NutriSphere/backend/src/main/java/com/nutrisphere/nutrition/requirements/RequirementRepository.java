package com.nutrisphere.nutrition.requirements;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface RequirementRepository extends JpaRepository<NutritionRequirement, Long> {
    Optional<NutritionRequirement> findFirstByPatientUserIdAndActiveTrue(Long patientUserId);
    List<NutritionRequirement> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId);
}
