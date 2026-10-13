package com.nutrisphere.medical.consultation;

import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConsultationServiceTest {

    @Mock
    private ConsultationRepository repo;
    @Mock
    private NotificationService notificationService;

    private ConsultationService service;

    @BeforeEach
    void setUp() {
        service = new ConsultationService(repo, notificationService);
    }

    @Test
    void create_SavesAndNotifiesPatient() {
        Consultation c = Consultation.builder()
            .patientUserId(10L)
            .doctorUserId(20L)
            .chiefComplaint("Chest tightness")
            .build();
        c.setId(1L);

        when(repo.save(any(Consultation.class))).thenReturn(c);

        Consultation created = service.create(c);
        assertNotNull(created);
        assertEquals(1L, created.getId());
        verify(notificationService).createNotification(eq(10L), eq("CONSULTATION"), anyString(), anyString(), eq(1L));
    }

    @Test
    void update_UpdatesFieldsAndSaves() {
        Consultation existing = Consultation.builder().chiefComplaint("Old").build();
        existing.setId(1L);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Consultation.class))).thenAnswer(i -> i.getArgument(0));

        Consultation updates = Consultation.builder().chiefComplaint("New").diagnosis("Acid reflux").build();

        Consultation res = service.update(1L, updates);
        assertEquals("New", res.getChiefComplaint());
        assertEquals("Acid reflux", res.getDiagnosis());
    }

    @Test
    void getById_ThrowsNotFoundWhenMissing() {
        when(repo.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }

    @Test
    void delete_DeletesById() {
        service.delete(1L);
        verify(repo).deleteById(1L);
    }
}
