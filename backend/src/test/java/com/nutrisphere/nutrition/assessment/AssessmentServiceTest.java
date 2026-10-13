package com.nutrisphere.nutrition.assessment;

import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.nutrition.assessment.dto.AssessmentRequest;
import com.nutrisphere.nutrition.assessment.dto.AssessmentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceTest {

    @Mock
    private AssessmentRepository repository;

    private AssessmentService service;

    @BeforeEach
    void setUp() {
        service = new AssessmentService(repository);
    }

    @Test
    void create_ComputesBmiAutomatically() {
        AssessmentRequest req = new AssessmentRequest();
        req.setPatientUserId(10L);
        req.setWeightKg(70.0);
        req.setHeightCm(175.0);
        req.setChiefComplaint("Fatigue");

        when(repository.save(any(NutritionAssessment.class))).thenAnswer(invocation -> {
            NutritionAssessment na = invocation.getArgument(0);
            na.setId(1L);
            return na;
        });

        AssessmentResponse response = service.create(5L, req);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        // 70 / (1.75 * 1.75) = 22.857 -> 22.9
        assertEquals(22.9, response.getBmi());
        assertEquals("Fatigue", response.getChiefComplaint());
    }

    @Test
    void create_UsesExplicitBmiIfProvided() {
        AssessmentRequest req = new AssessmentRequest();
        req.setPatientUserId(10L);
        req.setWeightKg(70.0);
        req.setHeightCm(175.0);
        req.setBmi(24.0);

        when(repository.save(any(NutritionAssessment.class))).thenAnswer(invocation -> {
            NutritionAssessment na = invocation.getArgument(0);
            na.setId(2L);
            return na;
        });

        AssessmentResponse response = service.create(5L, req);
        assertEquals(24.0, response.getBmi());
    }

    @Test
    void getById_FoundAndNotFound() {
        NutritionAssessment na = NutritionAssessment.builder()
            .patientUserId(10L)
            .assessmentDate(LocalDate.now())
            .build();
        na.setId(5L);

        when(repository.findById(5L)).thenReturn(Optional.of(na));
        when(repository.findById(999L)).thenReturn(Optional.empty());

        AssessmentResponse found = service.getById(5L);
        assertEquals(5L, found.getId());

        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }

    @Test
    void getForPatient_ReturnsList() {
        NutritionAssessment na = NutritionAssessment.builder().patientUserId(10L).build();
        na.setId(1L);
        when(repository.findByPatientUserIdOrderByAssessmentDateDesc(10L)).thenReturn(List.of(na));

        List<AssessmentResponse> list = service.getForPatient(10L);
        assertEquals(1, list.size());
    }
}
