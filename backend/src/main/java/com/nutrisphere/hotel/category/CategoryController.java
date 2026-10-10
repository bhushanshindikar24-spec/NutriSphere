package com.nutrisphere.hotel.category;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.hotel.category.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
@RestController @RequestMapping("/api/hotel/categories") @RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final SecurityUtils securityUtils;
    @PostMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<CategoryResponse> create(@RequestBody CategoryRequest req) {
        return ApiResponse.success(categoryService.create(securityUtils.getCurrentUserId(), req));
    }
    @GetMapping
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.success(categoryService.getAll(securityUtils.getCurrentUserId()));
    }
}
