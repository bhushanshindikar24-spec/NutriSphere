package com.nutrisphere.nutrition.food;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodNutrientRepository extends JpaRepository<FoodNutrient, Long> {
    List<FoodNutrient> findByFoodItemId(Long foodItemId);
}
