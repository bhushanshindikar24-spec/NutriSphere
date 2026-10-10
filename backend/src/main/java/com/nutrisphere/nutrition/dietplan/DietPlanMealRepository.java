package com.nutrisphere.nutrition.dietplan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DietPlanMealRepository extends JpaRepository<DietPlanMeal, Long> {
    List<DietPlanMeal> findByDietPlanIdOrderBySortOrder(Long planId);
}
