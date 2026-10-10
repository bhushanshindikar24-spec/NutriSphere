package com.nutrisphere.hotel.profile;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.hotel.profile.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
@RestController @RequestMapping("/api/hotel/profile") @RequiredArgsConstructor
public class HotelController {
    private final HotelService hotelService;
    private final SecurityUtils securityUtils;
    @GetMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<HotelProfileResponse> getProfile() {
        return ApiResponse.success(hotelService.getProfile(securityUtils.getCurrentUserId()));
    }
    @PutMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<HotelProfileResponse> updateProfile(@RequestBody HotelProfileRequest req) {
        return ApiResponse.success(hotelService.updateProfile(securityUtils.getCurrentUserId(), req));
    }
}
