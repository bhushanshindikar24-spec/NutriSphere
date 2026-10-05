package com.nutrisphere.intelligence.reality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface RealityScoreRepository extends JpaRepository<RealityScore, Long> {
    List<RealityScore> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId);
    Optional<RealityScore> findFirstByPatientUserIdOrderByCreatedAtDesc(Long patientUserId);
}
