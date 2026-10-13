package com.nutrisphere.medical.history;

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
class MedicalHistoryServiceTest {

    @Mock
    private MedicalHistoryRepository repo;

    private MedicalHistoryService service;

    @BeforeEach
    void setUp() {
        service = new MedicalHistoryService(repo);
    }

    @Test
    void getForPatient_ReturnsList() {
        MedicalHistory h = MedicalHistory.builder().conditionName("Hypertension").build();
        when(repo.findByPatientUserIdOrderByDiagnosisDateDesc(10L)).thenReturn(List.of(h));

        List<MedicalHistory> list = service.getForPatient(10L);
        assertEquals(1, list.size());
        assertEquals("Hypertension", list.get(0).getConditionName());
    }

    @Test
    void getById_FoundAndNotFound() {
        MedicalHistory h = MedicalHistory.builder().conditionName("Asthma").build();
        h.setId(1L);

        when(repo.findById(1L)).thenReturn(Optional.of(h));
        when(repo.findById(999L)).thenReturn(Optional.empty());

        assertEquals("Asthma", service.getById(1L).getConditionName());
        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }

    @Test
    void update_UpdatesFields() {
        MedicalHistory existing = MedicalHistory.builder().conditionName("Old").build();
        existing.setId(1L);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(MedicalHistory.class))).thenAnswer(i -> i.getArgument(0));

        MedicalHistory updates = MedicalHistory.builder().conditionName("Updated").treatment("Medication").build();
        MedicalHistory res = service.update(1L, updates);

        assertEquals("Updated", res.getConditionName());
        assertEquals("Medication", res.getTreatment());
    }

    @Test
    void delete_DeletesById() {
        service.delete(1L);
        verify(repo).deleteById(1L);
    }
}
