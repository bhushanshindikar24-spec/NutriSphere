package com.nutrisphere.hotel.profile;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.hotel.profile.dto.*;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class HotelService {
    private final HotelRepository hotelRepo;
    private final UserRepository userRepo;

    public HotelProfileResponse getProfile(Long userId) {
        HotelProfile p = hotelRepo.findByUserId(userId).orElseGet(() -> {
            var user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", userId));
            return HotelProfile.builder().user(user).hotelName(user.getFullName()).build();
        });
        return toResponse(p);
    }

    @Transactional
    public HotelProfileResponse updateProfile(Long userId, HotelProfileRequest req) {
        var user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", userId));
        HotelProfile p = hotelRepo.findByUserId(userId).orElse(new HotelProfile());
        p.setUser(user);
        p.setHotelName(req.getHotelName());
        p.setHotelAddress(req.getHotelAddress());
        p.setPhoneNumber(req.getPhoneNumber());
        p.setDescription(req.getDescription());
        p.setCuisineType(req.getCuisineType());
        return toResponse(hotelRepo.save(p));
    }

    private HotelProfileResponse toResponse(HotelProfile p) {
        HotelProfileResponse r = new HotelProfileResponse();
        r.setId(p.getId()); r.setUserId(p.getUser().getId());
        r.setHotelName(p.getHotelName()); r.setHotelAddress(p.getHotelAddress());
        r.setPhoneNumber(p.getPhoneNumber()); r.setDescription(p.getDescription());
        r.setCuisineType(p.getCuisineType()); r.setActive(p.isActive());
        return r;
    }
}
