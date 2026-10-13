package com.nutrisphere.medical.laboratory;

import com.nutrisphere.exception.ResourceNotFoundException;
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
class LaboratoryServiceTest {

    @Mock
    private LaboratoryReportRepository reportRepo;
    @Mock
    private LaboratoryValueRepository valueRepo;

    private LaboratoryService service;

    @BeforeEach
    void setUp() {
        service = new LaboratoryService(reportRepo, valueRepo);
    }

    @Test
    void getForPatient_ReturnsList() {
        LaboratoryReport report = LaboratoryReport.builder().title("Lipid Panel").build();
        when(reportRepo.findByPatientUserIdOrderByReportDateDesc(10L)).thenReturn(List.of(report));

        List<LaboratoryReport> list = service.getForPatient(10L);
        assertEquals(1, list.size());
        assertEquals("Lipid Panel", list.get(0).getTitle());
    }

    @Test
    void getById_FoundAndNotFound() {
        LaboratoryReport report = LaboratoryReport.builder().title("CBC").build();
        report.setId(1L);

        when(reportRepo.findById(1L)).thenReturn(Optional.of(report));
        when(reportRepo.findById(999L)).thenReturn(Optional.empty());

        assertEquals("CBC", service.getById(1L).getTitle());
        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }

    @Test
    void addValue_SavesValue() {
        LaboratoryValue val = LaboratoryValue.builder().parameterName("HbA1c").value("5.6").build();
        when(valueRepo.save(any(LaboratoryValue.class))).thenReturn(val);

        LaboratoryValue saved = service.addValue(val);
        assertEquals("HbA1c", saved.getParameterName());
        assertEquals("5.6", saved.getValue());
    }

    @Test
    void update_UpdatesFields() {
        LaboratoryReport existing = LaboratoryReport.builder().title("Old Title").build();
        existing.setId(1L);

        when(reportRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(reportRepo.save(any(LaboratoryReport.class))).thenAnswer(i -> i.getArgument(0));

        LaboratoryReport updates = LaboratoryReport.builder().title("New Title").status("COMPLETED").build();
        LaboratoryReport res = service.update(1L, updates);

        assertEquals("New Title", res.getTitle());
        assertEquals("COMPLETED", res.getStatus());
    }

    @Test
    void delete_DeletesById() {
        service.delete(1L);
        verify(reportRepo).deleteById(1L);
    }
}
