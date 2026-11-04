package com.nutrisphere.nutrition.requirements;

import com.nutrisphere.common.enums.ActivityLevel;
import com.nutrisphere.common.enums.Gender;
import com.nutrisphere.medical.laboratory.LaboratoryReportRepository;
import com.nutrisphere.medical.laboratory.LaboratoryValue;
import com.nutrisphere.medical.laboratory.LaboratoryValueRepository;
import com.nutrisphere.nutrition.requirements.dto.*;
import com.nutrisphere.patient.PatientProfile;
import com.nutrisphere.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequirementService {

    private final RequirementRepository repo;
    private final RequirementCalculator calculator;
    private final PatientRepository patientRepo;
    private final LaboratoryReportRepository labReportRepo;
    private final LaboratoryValueRepository labValueRepo;

    public RequirementService(RequirementRepository repo, RequirementCalculator calculator) {
        this(repo, calculator, null, null, null);
    }

    @Autowired
    public RequirementService(
            RequirementRepository repo,
            RequirementCalculator calculator,
            @Autowired(required = false) PatientRepository patientRepo,
            @Autowired(required = false) LaboratoryReportRepository labReportRepo,
            @Autowired(required = false) LaboratoryValueRepository labValueRepo) {
        this.repo = repo;
        this.calculator = calculator;
        this.patientRepo = patientRepo;
        this.labReportRepo = labReportRepo;
        this.labValueRepo = labValueRepo;
    }

    public RequirementResponse calculate(RequirementCalculationRequest req) {
        return calculator.calculate(req);
    }

    public RequirementResponse getDetailedForPatient(Long patientUserId) {
        PatientProfile profile = patientRepo != null ? patientRepo.findByUserId(patientUserId).orElse(null) : null;

        // 1. Gather biometrics
        double weight = (profile != null && profile.getWeightKg() != null && profile.getWeightKg() > 20) 
            ? profile.getWeightKg() : 65.0;
        double height = (profile != null && profile.getHeightCm() != null && profile.getHeightCm() > 50) 
            ? profile.getHeightCm() : 165.0;
        int age = 28;
        if (profile != null && profile.getDateOfBirth() != null) {
            age = Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears();
        }
        Gender gender = (profile != null && profile.getGender() != null) ? profile.getGender() : Gender.FEMALE;
        ActivityLevel activity = (profile != null && profile.getActivityLevel() != null) ? profile.getActivityLevel() : ActivityLevel.MODERATELY_ACTIVE;
        String goal = (profile != null && profile.getHealthGoals() != null && !profile.getHealthGoals().isBlank()) ? profile.getHealthGoals() : "MAINTENANCE";

        // 2. Gather clinical conditions
        List<String> conditions = new ArrayList<>();
        if (profile != null) {
            if (profile.getDiagnosedConditions() != null && !profile.getDiagnosedConditions().isBlank()) {
                conditions.add(profile.getDiagnosedConditions());
            }
            if (profile.getBloodPressure() != null && !profile.getBloodPressure().isBlank()) {
                String bp = profile.getBloodPressure().replaceAll("[^0-9/]", "");
                if (bp.contains("/")) {
                    try {
                        int sys = Integer.parseInt(bp.split("/")[0]);
                        if (sys >= 130) conditions.add("Hypertension / Elevated BP (" + profile.getBloodPressure() + ")");
                    } catch (Exception ignored) {}
                }
            }
        }

        // 3. Scan laboratory reports for deficiencies
        List<String> deficiencies = new ArrayList<>();
        if (labReportRepo != null && labValueRepo != null) {
            var reports = labReportRepo.findByPatientUserIdOrderByReportDateDesc(patientUserId);
            for (var rep : reports) {
                List<LaboratoryValue> values = labValueRepo.findByReportId(rep.getId());
                for (var v : values) {
                    String pName = v.getParameterName().toLowerCase();
                    Double num = parseDoubleSafe(v.getValue());
                    if (num != null) {
                        if ((pName.contains("vitamin d") || pName.contains("25-oh") || pName.contains("d3")) && num < 30.0) {
                            deficiencies.add("Vitamin D3 Insufficiency (" + num + " ng/mL)");
                        } else if ((pName.contains("b12") || pName.contains("cobalamin")) && num < 250.0) {
                            deficiencies.add("Vitamin B12 Deficiency (" + num + " pg/mL)");
                        } else if ((pName.contains("ferritin") || pName.contains("iron") || pName.contains("hemoglobin")) 
                                && num < (pName.contains("hemoglobin") ? 12.0 : 30.0)) {
                            deficiencies.add("Iron / Ferritin Deficiency (" + v.getParameterName() + ": " + num + ")");
                        } else if ((pName.contains("glucose") || pName.contains("sugar") || pName.contains("hba1c")) 
                                && (pName.contains("hba1c") ? num >= 5.7 : num > 100.0)) {
                            deficiencies.add("Elevated Glycemic Marker (" + v.getParameterName() + ": " + num + ")");
                        } else if ((pName.contains("cholesterol") || pName.contains("ldl")) && num > 100.0) {
                            deficiencies.add("Elevated LDL Cholesterol (" + num + " mg/dL)");
                        }
                    }
                }
            }
        }

        RequirementCalculationRequest calcReq = RequirementCalculationRequest.builder()
            .patientUserId(patientUserId)
            .weightKg(weight)
            .heightCm(height)
            .ageYears(age)
            .gender(gender)
            .activityLevel(activity)
            .goal(goal)
            .formula("MIFFLIN_ST_JEOR")
            .conditions(conditions)
            .deficiencies(deficiencies)
            .build();

        RequirementResponse response = calculator.calculate(calcReq);
        response.setPatientUserId(patientUserId);

        // Check if an existing approved requirement has custom overrides
        repo.findFirstByPatientUserIdAndActiveTrue(patientUserId).ifPresent(saved -> {
            response.setId(saved.getId());
            if (saved.getCaloriesTarget() != null) response.setCaloriesTarget(saved.getCaloriesTarget());
            if (saved.getProteinGTarget() != null) response.setProteinGTarget(saved.getProteinGTarget());
            if (saved.getCarbsGTarget() != null) response.setCarbsGTarget(saved.getCarbsGTarget());
            if (saved.getFatGTarget() != null) response.setFatGTarget(saved.getFatGTarget());
            if (saved.getFiberGTarget() != null) response.setFiberGTarget(saved.getFiberGTarget());
            if (saved.getWaterMlTarget() != null) response.setWaterMlTarget(saved.getWaterMlTarget());
            if (saved.getNotes() != null && !saved.getNotes().isBlank()) response.setNotes(saved.getNotes());
        });

        return response;
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
            .calculationMethod("Dietitian Clinician Override")
            .notes(req.getNotes()).build();
        return toResponse(repo.save(r));
    }

    public List<RequirementResponse> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private RequirementResponse toResponse(NutritionRequirement r) {
        RequirementResponse res = new RequirementResponse();
        res.setId(r.getId());
        res.setPatientUserId(r.getPatientUserId());
        res.setCaloriesTarget(r.getCaloriesTarget());
        res.setProteinGTarget(r.getProteinGTarget());
        res.setCarbsGTarget(r.getCarbsGTarget());
        res.setFatGTarget(r.getFatGTarget());
        res.setFiberGTarget(r.getFiberGTarget());
        res.setWaterMlTarget(r.getWaterMlTarget());
        res.setCalculationMethod(r.getCalculationMethod());
        res.setNotes(r.getNotes());
        res.setActive(r.isActive());
        return res;
    }

    private Double parseDoubleSafe(String val) {
        if (val == null) return null;
        try {
            return Double.parseDouble(val.replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            return null;
        }
    }
}
