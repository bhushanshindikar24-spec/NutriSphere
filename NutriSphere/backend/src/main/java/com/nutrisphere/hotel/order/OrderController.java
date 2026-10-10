package com.nutrisphere.hotel.order;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.hotel.order.dto.*;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest req) {
        return ApiResponse.success(orderService.placeOrder(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping({"/my", "/my-orders"})
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<OrderResponse>> getMyOrders() {
        return ApiResponse.success(orderService.getPatientOrders(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/hotel")
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<List<OrderResponse>> getHotelOrders() {
        return ApiResponse.success(orderService.getHotelOrders(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<OrderResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(orderService.getById(id, securityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('HOTEL')")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable Long id,
            @RequestBody OrderStatusRequest req) {
        return ApiResponse.success(orderService.updateStatus(id, securityUtils.getCurrentUserId(), req));
    }
}
