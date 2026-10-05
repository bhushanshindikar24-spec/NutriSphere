package com.nutrisphere.hotel.availability;
import com.nutrisphere.hotel.availability.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class AvailabilityService {
    private final AvailabilityRepository repo;
    @Transactional
    public AvailabilityResponse setAvailability(Long hotelUserId, AvailabilityRequest req) {
        HotelAvailability a = HotelAvailability.builder()
            .mealId(req.getMealId()).hotelUserId(hotelUserId)
            .dayOfWeek(req.getDayOfWeek()).startTime(req.getStartTime())
            .endTime(req.getEndTime()).available(req.isAvailable())
            .maxOrders(req.getMaxOrders()).build();
        return toResponse(repo.save(a));
    }
    public List<AvailabilityResponse> getForHotel(Long hotelUserId) {
        return repo.findByHotelUserIdAndAvailableTrue(hotelUserId).stream().map(this::toResponse).collect(Collectors.toList());
    }
    private AvailabilityResponse toResponse(HotelAvailability a) {
        AvailabilityResponse r = new AvailabilityResponse();
        r.setId(a.getId()); r.setMealId(a.getMealId()); r.setHotelUserId(a.getHotelUserId());
        r.setDayOfWeek(a.getDayOfWeek()); r.setStartTime(a.getStartTime()); r.setEndTime(a.getEndTime());
        r.setAvailable(a.isAvailable()); r.setMaxOrders(a.getMaxOrders());
        return r;
    }
}
