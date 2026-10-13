package com.nutrisphere.nutrition.progress;

import com.nutrisphere.nutrition.progress.dto.MeasurementRequest;
import com.nutrisphere.nutrition.progress.dto.MeasurementResponse;
import com.nutrisphere.nutrition.progress.dto.ProgressResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {

    @Mock
    private MeasurementRepository measurementRepo;
    @Mock
    private ProgressRepository progressRepo;

    private ProgressService service;

    @BeforeEach
    void setUp() {
        service = new ProgressService(measurementRepo, progressRepo);
    }

    @Test
    void recordMeasurement_CalculatesBmiAndSaves() {
        MeasurementRequest req = new MeasurementRequest();
        req.setPatientUserId(10L);
        req.setWeightKg(80.0);
        req.setHeightCm(180.0);
        req.setMeasurementDate(LocalDate.now());

        when(measurementRepo.save(any(PatientMeasurement.class))).thenAnswer(invocation -> {
            PatientMeasurement pm = invocation.getArgument(0);
            pm.setId(100L);
            return pm;
        });

        MeasurementResponse res = service.recordMeasurement(5L, req);

        assertNotNull(res);
        assertEquals(100L, res.getId());
        // 80 / (1.8 * 1.8) = 24.69 -> 24.7
        assertEquals(24.7, res.getBmi());
        assertEquals(80.0, res.getWeightKg());
    }

    @Test
    void getMeasurements_ReturnsList() {
        PatientMeasurement pm = PatientMeasurement.builder()
            .patientUserId(10L)
            .weightKg(75.0)
            .build();
        pm.setId(1L);

        when(measurementRepo.findByPatientUserIdOrderByMeasurementDateDesc(10L)).thenReturn(List.of(pm));

        List<MeasurementResponse> list = service.getMeasurements(10L);
        assertEquals(1, list.size());
        assertEquals(75.0, list.get(0).getWeightKg());
    }

    @Test
    void getProgress_ReturnsList() {
        ProgressRecord pr = ProgressRecord.builder()
            .patientUserId(10L)
            .adherencePercent(85.0)
            .build();
        pr.setId(1L);

        when(progressRepo.findByPatientUserIdOrderByRecordDateDesc(10L)).thenReturn(List.of(pr));

        List<ProgressResponse> list = service.getProgress(10L);
        assertEquals(1, list.size());
        assertEquals(85.0, list.get(0).getAdherencePercent());
    }
}
