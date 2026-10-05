package com.nutrisphere.nutrition.requirements;
import com.nutrisphere.nutrition.requirements.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class RequirementService {
    private final RequirementRepository repo;
    private final RequirementCalculator calculator;

    public RequirementResponse calculate(RequirementCalculationRequest req) {
        return calculator.calculate(req);
    }

    @Transactional
    public RequirementResponse save(Long dietitianUserId, RequirementRequest req) {
        repo.findFirstByPatientUserIdAndActiveTrue(req.getPatientUserId())
            .ifPresent(old -> { old.setActive(false); repo.save(old); });
        NutritionRequirement r = NutritionRequirement.builder()
            .patientUserId(req.getPatientUserId()).dietitianUserId(dietitianUserId)
            .caloriesTarget(req.getCaloriesTarget()).proteinGTarget(req.getProteinGTarget())
            .carbsGTarget(req.getCarbsGTarget()).fatGTarget(req.getFatGTarget())
            .fiberGTarget(req.getFiberGTarget()).waterMlTarget(req.getWaterMlTarget())
            .notes(req.getNotes()).build();
        return toResponse(repo.save(r));
    }

    public List<RequirementResponse> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private RequirementResponse toResponse(NutritionRequirement r) {
        RequirementResponse res = new RequirementResponse();
        res.setId(r.getId()); res.setPatientUserId(r.getPatientUserId());
        res.setCaloriesTarget(r.getCaloriesTarget()); res.setProteinGTarget(r.getProteinGTarget());
        res.setCarbsGTarget(r.getCarbsGTarget()); res.setFatGTarget(r.getFatGTarget());
        res.setFiberGTarget(r.getFiberGTarget()); res.setWaterMlTarget(r.getWaterMlTarget());
        res.setCalculationMethod(r.getCalculationMethod()); res.setNotes(r.getNotes());
        res.setActive(r.isActive());
        return res;
    }
}
