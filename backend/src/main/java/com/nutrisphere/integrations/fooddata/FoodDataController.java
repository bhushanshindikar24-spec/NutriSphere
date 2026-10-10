package com.nutrisphere.integrations.fooddata;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.food.FoodItem;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/integrations/fooddata")
@RequiredArgsConstructor
public class FoodDataController {

    private final FoodDataService service;

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<FoodItem>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "15") int pageSize) {
        return ApiResponse.success(service.searchFoods(query, pageSize));
    }

    @GetMapping("/{fdcId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<FoodItem> getDetails(@PathVariable String fdcId) {
        FoodItem item = service.getFoodDetails(fdcId);
        if (item == null) {
            return ApiResponse.error("Food item not found with FDC ID: " + fdcId);
        }
        return ApiResponse.success(item);
    }

    @PostMapping("/import/{fdcId}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR')")
    public ApiResponse<FoodItem> importFood(@PathVariable String fdcId) {
        return ApiResponse.success("Food imported successfully", service.importFood(fdcId));
    }
}
