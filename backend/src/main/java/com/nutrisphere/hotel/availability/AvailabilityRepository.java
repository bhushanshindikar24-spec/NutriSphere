package com.nutrisphere.hotel.availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AvailabilityRepository extends JpaRepository<HotelAvailability, Long> {
    List<HotelAvailability> findByHotelUserIdAndAvailableTrue(Long hotelUserId);
    List<HotelAvailability> findByMealIdAndAvailableTrue(Long mealId);
}
