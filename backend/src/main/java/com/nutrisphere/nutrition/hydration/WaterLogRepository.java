package com.nutrisphere.nutrition.hydration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface WaterLogRepository extends JpaRepository<WaterLog, Long> {
    List<WaterLog> findByPatientUserIdAndLogDateOrderByLogTime(Long patientUserId, LocalDate date);
    @Query("SELECT COALESCE(SUM(w.amountMl),0) FROM WaterLog w WHERE w.patientUserId=:uid AND w.logDate=:date")
    Double sumAmountForDate(Long uid, LocalDate date);
}
