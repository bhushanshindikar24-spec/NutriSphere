package com.nutrisphere.intelligence.adherence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface AdherenceBarrierRepository extends JpaRepository<AdherenceBarrier, Long> {
    List<AdherenceBarrier> findByPatientUserIdOrderByBarrierDateDesc(Long patientUserId);
    List<AdherenceBarrier> findByPatientUserIdAndBarrierDateBetween(Long patientUserId, LocalDate from, LocalDate to);
    @Query("SELECT a.barrierType, COUNT(a) FROM AdherenceBarrier a WHERE a.patientUserId=:uid GROUP BY a.barrierType ORDER BY COUNT(a) DESC")
    List<Object[]> countByBarrierType(Long uid);
}
