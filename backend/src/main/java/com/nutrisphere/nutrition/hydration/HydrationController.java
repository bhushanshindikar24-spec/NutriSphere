package com.nutrisphere.nutrition.hydration;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.hydration.dto.*;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
@RestController @RequestMapping("/api/water-logs") @RequiredArgsConstructor
public class HydrationController {
    private final HydrationService hydrationService;
    private final SecurityUtils securityUtils;
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<?> logWater(@Valid @RequestBody WaterLogRequest req) {
        return ApiResponse.success(hydrationService.logWater(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<java.util.List<WaterLog>> getTodayLogs() {
        return ApiResponse.success(hydrationService.getTodayLogs(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<HydrationSummaryResponse> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ApiResponse.success(hydrationService.getSummary(securityUtils.getCurrentUserId(), date));
    }
}
