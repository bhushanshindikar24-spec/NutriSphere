package com.nutrisphere.hotel.profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface HotelRepository extends JpaRepository<HotelProfile, Long> {
    Optional<HotelProfile> findByUserId(Long userId);
}
