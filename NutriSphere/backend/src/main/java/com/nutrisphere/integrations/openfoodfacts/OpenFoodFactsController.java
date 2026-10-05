package com.nutrisphere.integrations.openfoodfacts;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.food.FoodItem;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/integrations/openfoodfacts")
@RequiredArgsConstructor
public class OpenFoodFactsController {

    private final OpenFoodFactsService service;

    @GetMapping("/barcode/{barcode}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<FoodItem> getByBarcode(@PathVariable String barcode) {
        FoodItem item = service.getByBarcode(barcode);
        if (item == null) {
            return ApiResponse.error("Product not found with barcode: " + barcode);
        }
        return ApiResponse.success(item);
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<FoodItem>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "15") int pageSize) {
        return ApiResponse.success(service.searchProducts(query, pageSize));
    }

    @PostMapping("/import/{barcode}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR')")
    public ApiResponse<FoodItem> importProduct(@PathVariable String barcode) {
        return ApiResponse.success("Product imported successfully", service.importByBarcode(barcode));
    }
}
