package com.nutrisphere.intelligence.homefood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface HomeFoodInventoryRepository extends JpaRepository<HomeFoodInventory, Long> {
    List<HomeFoodInventory> findByPatientUserIdAndAvailableTrue(Long patientUserId);
    void deleteByPatientUserIdAndFoodName(Long patientUserId, String foodName);
}
