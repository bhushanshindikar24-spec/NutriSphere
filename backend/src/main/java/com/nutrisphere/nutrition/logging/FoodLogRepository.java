package com.nutrisphere.nutrition.logging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodLogRepository extends JpaRepository<FoodLog, Long> {
    List<FoodLog> findByPatientUserIdAndLogDateOrderByLogTime(Long patientUserId, LocalDate logDate);
    List<FoodLog> findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(Long patientUserId, LocalDate from, LocalDate to);

    @Query("SELECT COALESCE(SUM(f.calories),0) FROM FoodLog f WHERE f.patientUserId=:uid AND f.logDate=:date")
    Double sumCaloriesForDate(Long uid, LocalDate date);
}
