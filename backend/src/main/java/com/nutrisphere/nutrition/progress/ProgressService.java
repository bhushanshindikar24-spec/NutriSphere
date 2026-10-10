package com.nutrisphere.nutrition.progress;
import com.nutrisphere.nutrition.progress.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class ProgressService {
    private final MeasurementRepository measurementRepo;
    private final ProgressRepository progressRepo;

    @Transactional
    public MeasurementResponse recordMeasurement(Long dietitianUserId, MeasurementRequest req) {
        PatientMeasurement m = PatientMeasurement.builder()
            .patientUserId(req.getPatientUserId()).measuredByUserId(dietitianUserId)
            .measurementDate(req.getMeasurementDate()).weightKg(req.getWeightKg())
            .heightCm(req.getHeightCm()).waistCm(req.getWaistCm())
            .hipCm(req.getHipCm()).bodyFatPercent(req.getBodyFatPercent())
            .muscleMassKg(req.getMuscleMassKg()).notes(req.getNotes()).build();
        if (req.getHeightCm() != null && req.getWeightKg() != null && req.getHeightCm() > 0) {
            double h = req.getHeightCm() / 100.0;
            m.setBmi(Math.round((req.getWeightKg() / (h*h)) * 10.0) / 10.0);
        }
        return toMeasurementResponse(measurementRepo.save(m));
    }

    public List<MeasurementResponse> getMeasurements(Long patientUserId) {
        return measurementRepo.findByPatientUserIdOrderByMeasurementDateDesc(patientUserId)
            .stream().map(this::toMeasurementResponse).collect(Collectors.toList());
    }

    public List<ProgressResponse> getProgress(Long patientUserId) {
        return progressRepo.findByPatientUserIdOrderByRecordDateDesc(patientUserId)
            .stream().map(this::toProgressResponse).collect(Collectors.toList());
    }

    private MeasurementResponse toMeasurementResponse(PatientMeasurement m) {
        MeasurementResponse r = new MeasurementResponse();
        r.setId(m.getId()); r.setPatientUserId(m.getPatientUserId());
        r.setMeasurementDate(m.getMeasurementDate()); r.setWeightKg(m.getWeightKg());
        r.setHeightCm(m.getHeightCm()); r.setBmi(m.getBmi());
        r.setWaistCm(m.getWaistCm()); r.setHipCm(m.getHipCm());
        r.setBodyFatPercent(m.getBodyFatPercent()); r.setMuscleMassKg(m.getMuscleMassKg());
        r.setNotes(m.getNotes());
        return r;
    }

    private ProgressResponse toProgressResponse(ProgressRecord p) {
        ProgressResponse r = new ProgressResponse();
        r.setId(p.getId()); r.setPatientUserId(p.getPatientUserId());
        r.setRecordDate(p.getRecordDate()); r.setNotes(p.getNotes());
        r.setAdherencePercent(p.getAdherencePercent()); r.setCaloriesConsumed(p.getCaloriesConsumed());
        r.setWaterConsumedMl(p.getWaterConsumedMl());
        return r;
    }
}
