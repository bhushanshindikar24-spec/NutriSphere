package com.nutrisphere.nutrition.progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ProgressRepository extends JpaRepository<ProgressRecord, Long> {
    List<ProgressRecord> findByPatientUserIdOrderByRecordDateDesc(Long patientUserId);
}
