package com.nutrisphere.nutrition.food;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.food.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/food") @RequiredArgsConstructor
public class FoodController {
    private final FoodService foodService;

    @GetMapping
    public ApiResponse<Page<FoodResponse>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(foodService.search(query, category, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<FoodResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(foodService.getById(id));
    }

    @PostMapping
    public ApiResponse<FoodResponse> create(@RequestBody FoodRequest req) {
        return ApiResponse.success(foodService.create(req));
    }
}
