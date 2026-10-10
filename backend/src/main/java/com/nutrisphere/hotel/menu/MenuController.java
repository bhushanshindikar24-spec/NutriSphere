package com.nutrisphere.hotel.menu;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.hotel.menu.dto.*;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/hotel/meals") @RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<MealResponse> addMeal(@Valid @RequestBody MealRequest req) {
        return ApiResponse.success(menuService.addMeal(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<List<MealResponse>> getMenu() {
        return ApiResponse.success(menuService.getMenu(securityUtils.getCurrentUserId()));
    }

    @GetMapping({"/public", "/available"})
    public ApiResponse<List<MealResponse>> getAllMenus() {
        return ApiResponse.success(menuService.getAllMenus());
    }

    @GetMapping("/{id}")
    public ApiResponse<MealResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(menuService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<MealResponse> update(@PathVariable Long id, @RequestBody MealUpdateRequest req) {
        return ApiResponse.success(menuService.updateMeal(id, securityUtils.getCurrentUserId(), req));
    }

    @RequestMapping(value = "/{id}/availability", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<MealResponse> updateAvailability(@PathVariable Long id, @RequestBody(required = false) AvailabilityRequest req) {
        Boolean available = (req != null) ? (req.getIsAvailable() != null ? req.getIsAvailable() : req.getAvailable()) : null;
        return ApiResponse.success(menuService.updateAvailability(id, securityUtils.getCurrentUserId(), available));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<String> deleteMeal(@PathVariable Long id) {
        menuService.deleteMeal(id, securityUtils.getCurrentUserId());
        return ApiResponse.success("Meal deleted successfully");
    }

    @lombok.Data
    public static class AvailabilityRequest {
        private Boolean isAvailable;
        private Boolean available;
    }
}
