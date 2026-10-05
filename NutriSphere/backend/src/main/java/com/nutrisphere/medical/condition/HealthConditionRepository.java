package com.nutrisphere.medical.condition;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthConditionRepository extends JpaRepository<HealthCondition, Long> {
    List<HealthCondition> findByActiveTrue();
    List<HealthCondition> findByCategoryAndActiveTrue(String category);
}
