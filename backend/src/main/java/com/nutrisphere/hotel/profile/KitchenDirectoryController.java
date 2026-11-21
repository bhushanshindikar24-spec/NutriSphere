package com.nutrisphere.hotel.profile;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.hotel.profile.dto.HotelProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Read-only directory of approved partner kitchens for authenticated users (e.g. patients). */
@RestController
@RequestMapping("/api/hotel/kitchens")
@RequiredArgsConstructor
public class KitchenDirectoryController {
    private final HotelService hotelService;

    @GetMapping
    public ApiResponse<List<HotelProfileResponse>> list() {
        return ApiResponse.success(hotelService.listApprovedKitchens());
    }

    @GetMapping("/{hotelUserId}")
    public ApiResponse<HotelProfileResponse> get(@PathVariable Long hotelUserId) {
        return ApiResponse.success(hotelService.getApprovedKitchen(hotelUserId));
    }
}
