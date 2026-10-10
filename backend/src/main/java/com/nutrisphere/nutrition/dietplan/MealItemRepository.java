package com.nutrisphere.nutrition.dietplan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MealItemRepository extends JpaRepository<MealItem, Long> {
    List<MealItem> findByDietPlanMealId(Long mealId);
    void deleteByDietPlanMealId(Long mealId);
}
