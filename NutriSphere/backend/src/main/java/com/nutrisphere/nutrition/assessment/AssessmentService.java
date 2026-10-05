package com.nutrisphere.nutrition.assessment;

import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.nutrition.assessment.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service 
@RequiredArgsConstructor
public class AssessmentService {
    private final AssessmentRepository repo;

    @Transactional
    public AssessmentResponse create(Long dietitianUserId, AssessmentRequest req) {
        Long pId = req.getPatientUserId() != null ? req.getPatientUserId() : req.getPatientId();
        LocalDate date = req.getAssessmentDate() != null ? req.getAssessmentDate() : LocalDate.now();
        String complaint = req.getChiefComplaint() != null ? req.getChiefComplaint() : req.getClinicalDiagnosis();
        String habits = req.getDietaryHabits() != null ? req.getDietaryHabits() : req.getDietaryHistory();
        String notes = req.getNotes() != null ? req.getNotes() : req.getRecommendations();

        NutritionAssessment a = NutritionAssessment.builder()
            .patientUserId(pId)
            .dietitianUserId(dietitianUserId)
            .assessmentDate(date)
            .weightKg(req.getWeightKg())
            .heightCm(req.getHeightCm())
            .bodyFatPercent(req.getBodyFatPercent())
            .muscleMassKg(req.getMuscleMassKg())
            .waistCm(req.getWaistCm())
            .hipCm(req.getHipCm())
            .chiefComplaint(complaint)
            .dietaryHabits(habits)
            .foodAllergies(req.getFoodAllergies())
            .supplements(req.getSupplements())
            .notes(notes)
            .build();

        if (req.getBmi() != null) {
            a.setBmi(req.getBmi());
        } else if (req.getHeightCm() != null && req.getWeightKg() != null && req.getHeightCm() > 0) {
            double h = req.getHeightCm() / 100.0;
            a.setBmi(Math.round((req.getWeightKg() / (h * h)) * 10.0) / 10.0);
        }

        return toResponse(repo.save(a));
    }

    public AssessmentResponse getById(Long id) {
        NutritionAssessment a = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("NutritionAssessment", id));
        return toResponse(a);
    }

    public List<AssessmentResponse> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByAssessmentDateDesc(patientUserId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    private AssessmentResponse toResponse(NutritionAssessment a) {
        AssessmentResponse r = new AssessmentResponse();
        r.setId(a.getId()); 
        r.setPatientUserId(a.getPatientUserId());
        r.setDietitianUserId(a.getDietitianUserId()); 
        r.setAssessmentDate(a.getAssessmentDate());
        r.setWeightKg(a.getWeightKg()); 
        r.setHeightCm(a.getHeightCm());
        r.setBmi(a.getBmi()); 
        r.setBodyFatPercent(a.getBodyFatPercent());
        r.setMuscleMassKg(a.getMuscleMassKg());
        r.setWaistCm(a.getWaistCm());
        r.setHipCm(a.getHipCm());
        r.setChiefComplaint(a.getChiefComplaint());
        r.setClinicalDiagnosis(a.getChiefComplaint());
        r.setDietaryHabits(a.getDietaryHabits());
        r.setDietaryHistory(a.getDietaryHabits());
        r.setFoodAllergies(a.getFoodAllergies());
        r.setSupplements(a.getSupplements());
        r.setNotes(a.getNotes());
        r.setRecommendations(a.getNotes());
        return r;
    }
}
