package com.nutrisphere.intelligence.homefood;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/home-food") @RequiredArgsConstructor
public class HomeFoodController {
    private final HomeFoodService homeFoodService;
    private final SecurityUtils securityUtils;

    @PostMapping("/inventory")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<HomeFoodInventory> addItem(@RequestBody InventoryRequest req) {
        return ApiResponse.success(homeFoodService.addToInventory(
            securityUtils.getCurrentUserId(), req.getFoodName(), req.getQuantityG(), req.getUnit(), req.getFoodItemId(), req.getCategory()));
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<HomeFoodInventory>> getInventory() {
        return ApiResponse.success(homeFoodService.getInventory(securityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/inventory/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<Void> removeItem(@PathVariable Long id) {
        homeFoodService.removeFromInventory(id, securityUtils.getCurrentUserId());
        return ApiResponse.success("Removed", null);
    }

    @GetMapping("/suggestions")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<HomeFoodSuggestion>> getSuggestions() {
        return ApiResponse.success(homeFoodService.generateSuggestions(securityUtils.getCurrentUserId()));
    }

    @PostMapping({"/suggestions/generate", "/suggestions"})
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<HomeFoodSuggestion>> generateSuggestions() {
        return ApiResponse.success(homeFoodService.generateSuggestions(securityUtils.getCurrentUserId()));
    }

    @Data
    public static class InventoryRequest {
        private Long foodItemId;
        private String foodName;
        private Double quantityG;
        private String unit;
        private String category;
    }
}
