package com.nutrisphere.hotel.order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface HotelOrderRepository extends JpaRepository<HotelOrder, Long> {
    List<HotelOrder> findByPatientUserIdOrderByCreatedAtDesc(Long patientUserId);
    List<HotelOrder> findByHotelUserIdOrderByCreatedAtDesc(Long hotelUserId);
    List<HotelOrder> findByHotelUserIdAndStatus(Long hotelUserId, OrderStatus status);
}
