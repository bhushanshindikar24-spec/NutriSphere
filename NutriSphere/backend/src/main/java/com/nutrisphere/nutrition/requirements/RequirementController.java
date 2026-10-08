package com.nutrisphere.nutrition.requirements;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.requirements.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/nutrition/requirements") @RequiredArgsConstructor
public class RequirementController {
    private final RequirementService requirementService;
    private final SecurityUtils securityUtils;

    @PostMapping("/calculate")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<RequirementResponse> calculate(@RequestBody RequirementCalculationRequest req) {
        return ApiResponse.success(requirementService.calculate(req));
    }

    @PostMapping
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<RequirementResponse> save(@RequestBody RequirementRequest req) {
        securityUtils.assertPatientAccess(req.getPatientUserId());
        return ApiResponse.success(requirementService.save(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','DIETITIAN','ADMIN')")
    public ApiResponse<List<RequirementResponse>> getForPatient(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(requirementService.getForPatient(patientUserId));
    }
}
