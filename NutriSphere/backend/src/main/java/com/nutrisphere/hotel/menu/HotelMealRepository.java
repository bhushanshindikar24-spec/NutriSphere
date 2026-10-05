package com.nutrisphere.hotel.menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface HotelMealRepository extends JpaRepository<HotelMeal, Long> {
    List<HotelMeal> findByHotelUserId(Long hotelUserId);
    List<HotelMeal> findByHotelUserIdAndAvailableTrue(Long hotelUserId);
    List<HotelMeal> findByHotelUserIdAndCategoryIdAndAvailableTrue(Long hotelUserId, Long categoryId);
    List<HotelMeal> findByAvailableTrue();
}
