package com.nutrisphere.medical.condition;

import com.nutrisphere.exception.ResourceNotFoundException;
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
class ConditionServiceTest {

    @Mock
    private HealthConditionRepository healthConditionRepo;
    @Mock
    private PatientConditionRepository patientConditionRepo;

    private ConditionService service;

    @BeforeEach
    void setUp() {
        service = new ConditionService(healthConditionRepo, patientConditionRepo);
    }

    @Test
    void getAllHealthConditions_ReturnsActiveOnly() {
        HealthCondition c = HealthCondition.builder().name("Type 2 Diabetes").active(true).build();
        when(healthConditionRepo.findByActiveTrue()).thenReturn(List.of(c));

        List<HealthCondition> list = service.getAllHealthConditions();
        assertEquals(1, list.size());
        assertEquals("Type 2 Diabetes", list.get(0).getName());
    }

    @Test
    void getPatientConditions_ReturnsActiveOnly() {
        PatientCondition pc = PatientCondition.builder().patientUserId(10L).active(true).build();
        when(patientConditionRepo.findByPatientUserIdAndActiveTrue(10L)).thenReturn(List.of(pc));

        List<PatientCondition> list = service.getPatientConditions(10L);
        assertEquals(1, list.size());
    }

    @Test
    void removePatientCondition_SetsActiveFalse() {
        PatientCondition pc = PatientCondition.builder().active(true).build();
        pc.setId(5L);

        when(patientConditionRepo.findById(5L)).thenReturn(Optional.of(pc));

        service.removePatientCondition(5L);

        assertFalse(pc.isActive());
        verify(patientConditionRepo).save(pc);
    }

    @Test
    void getById_ThrowsNotFoundWhenMissing() {
        when(patientConditionRepo.findById(404L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getById(404L));
    }
}
