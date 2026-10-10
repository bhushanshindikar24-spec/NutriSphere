package com.nutrisphere.hotel.category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CategoryRepository extends JpaRepository<HotelCategory, Long> {
    List<HotelCategory> findByHotelUserIdAndActiveTrue(Long hotelUserId);
}
