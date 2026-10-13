package com.nutrisphere.nutrition.requirements;

import com.nutrisphere.nutrition.requirements.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequirementServiceTest {

    @Mock
    private RequirementRepository repository;
    @Mock
    private RequirementCalculator calculator;

    private RequirementService service;

    @BeforeEach
    void setUp() {
        service = new RequirementService(repository, calculator);
    }

    @Test
    void calculate_DelegatesToCalculator() {
        RequirementCalculationRequest req = new RequirementCalculationRequest();
        RequirementResponse expected = new RequirementResponse();
        expected.setCaloriesTarget(2200.0);

        when(calculator.calculate(req)).thenReturn(expected);

        RequirementResponse res = service.calculate(req);
        assertEquals(2200.0, res.getCaloriesTarget());
        verify(calculator).calculate(req);
    }

    @Test
    void save_DeactivatesPreviousActiveRequirementAndSavesNew() {
        RequirementRequest req = new RequirementRequest();
        req.setPatientUserId(10L);
        req.setCaloriesTarget(2000.0);
        req.setProteinGTarget(100.0);

        NutritionRequirement oldReq = NutritionRequirement.builder()
            .patientUserId(10L)
            .active(true)
            .build();

        NutritionRequirement savedReq = NutritionRequirement.builder()
            .patientUserId(10L)
            .caloriesTarget(2000.0)
            .proteinGTarget(100.0)
            .active(true)
            .build();
        savedReq.setId(55L);

        when(repository.findFirstByPatientUserIdAndActiveTrue(10L)).thenReturn(Optional.of(oldReq));
        when(repository.save(any(NutritionRequirement.class))).thenReturn(savedReq);

        RequirementResponse res = service.save(99L, req);

        assertNotNull(res);
        assertEquals(55L, res.getId());
        assertEquals(2000.0, res.getCaloriesTarget());
        assertFalse(oldReq.isActive());
        verify(repository, atLeast(2)).save(any(NutritionRequirement.class));
    }

    @Test
    void getForPatient_ReturnsList() {
        NutritionRequirement req = NutritionRequirement.builder()
            .patientUserId(10L)
            .caloriesTarget(1800.0)
            .active(true)
            .build();
        req.setId(1L);

        when(repository.findByPatientUserIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(req));

        List<RequirementResponse> list = service.getForPatient(10L);
        assertEquals(1, list.size());
        assertEquals(1800.0, list.get(0).getCaloriesTarget());
    }
}
