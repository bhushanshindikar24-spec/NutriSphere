package com.nutrisphere.nutrition.logging;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.logging.dto.*;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController @RequestMapping("/api/food-logs") @RequiredArgsConstructor
public class FoodLogController {
    private final FoodLogService foodLogService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<FoodLogResponse> logFood(@Valid @RequestBody FoodLogRequest req) {
        return ApiResponse.success(foodLogService.logFood(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<FoodLogResponse>> getToday() {
        return ApiResponse.success(foodLogService.getLogsForDate(securityUtils.getCurrentUserId(), LocalDate.now()));
    }

    @GetMapping("/date/{date}")
    public ApiResponse<List<FoodLogResponse>> getForDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long patientUserId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(uid);
        return ApiResponse.success(foodLogService.getLogsForDate(uid, date));
    }

    @GetMapping("/range")
    public ApiResponse<List<FoodLogResponse>> getRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) Long patientUserId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(uid);
        return ApiResponse.success(foodLogService.getLogsForRange(uid, from, to));
    }

    @PostMapping("/deviations")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<Void> recordDeviation(@RequestBody MealDeviationRequest req) {
        foodLogService.recordDeviation(securityUtils.getCurrentUserId(), req);
        return ApiResponse.success("Deviation recorded", null);
    }

    @GetMapping("/planned-vs-actual")
    public ApiResponse<PlannedVsActualResponse> plannedVsActual(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long patientUserId) {
        if (date == null) date = LocalDate.now();
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(uid);
        return ApiResponse.success(foodLogService.getPlannedVsActual(uid, date));
    }
}
