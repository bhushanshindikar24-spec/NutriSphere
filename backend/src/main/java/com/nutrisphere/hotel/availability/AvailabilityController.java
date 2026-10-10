package com.nutrisphere.hotel.availability;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.hotel.availability.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
@RestController @RequestMapping("/api/hotel/availability") @RequiredArgsConstructor
public class AvailabilityController {
    private final AvailabilityService availabilityService;
    private final SecurityUtils securityUtils;
    @PostMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<AvailabilityResponse> set(@RequestBody AvailabilityRequest req) {
        return ApiResponse.success(availabilityService.setAvailability(securityUtils.getCurrentUserId(), req));
    }
    @GetMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<List<AvailabilityResponse>> getAll() {
        return ApiResponse.success(availabilityService.getForHotel(securityUtils.getCurrentUserId()));
    }
}
