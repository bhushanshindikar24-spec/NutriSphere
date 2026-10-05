package com.nutrisphere.nutrition.food;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<FoodItem, Long> {
    @Query("SELECT f FROM FoodItem f WHERE f.active = true AND (LOWER(f.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(f.brand) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<FoodItem> searchActive(String q, Pageable pageable);

    Page<FoodItem> findByActiveTrueAndCategory(String category, Pageable pageable);
    Page<FoodItem> findByActiveTrue(Pageable pageable);
}
