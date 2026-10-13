package com.nutrisphere.doctor;

import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.common.enums.Status;
import com.nutrisphere.doctor.dto.DoctorDashboardResponse;
import com.nutrisphere.doctor.dto.DoctorProfileRequest;
import com.nutrisphere.doctor.dto.DoctorProfileResponse;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.medical.consultation.Consultation;
import com.nutrisphere.medical.consultation.ConsultationRepository;
import com.nutrisphere.notification.NotificationRepository;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserRepository;
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
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DoctorMapper doctorMapper;
    @Mock
    private DoctorPatientRepository doctorPatientRepository;
    @Mock
    private ConsultationRepository consultationRepository;
    @Mock
    private NotificationRepository notificationRepository;

    private DoctorService service;

    @BeforeEach
    void setUp() {
        service = new DoctorService(
            doctorRepository,
            userRepository,
            doctorMapper,
            doctorPatientRepository,
            consultationRepository,
            notificationRepository
        );
    }

    @Test
    void getProfile_ReturnsResponse() {
        DoctorProfile profile = new DoctorProfile();
        when(doctorRepository.findByUserId(10L)).thenReturn(Optional.of(profile));
        when(doctorMapper.toResponse(profile)).thenReturn(new DoctorProfileResponse());

        assertNotNull(service.getProfile(10L));
    }

    @Test
    void updateProfile_Success() {
        User user = User.builder().build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(doctorRepository.findByUserId(10L)).thenReturn(Optional.of(new DoctorProfile()));
        when(doctorRepository.save(any(DoctorProfile.class))).thenAnswer(i -> i.getArgument(0));
        when(doctorMapper.toResponse(any(DoctorProfile.class))).thenReturn(new DoctorProfileResponse());

        DoctorProfileRequest req = new DoctorProfileRequest();
        req.setSpecialization("Cardiology");
        req.setConsultationFee(150.0);

        assertNotNull(service.updateProfile(10L, req));
        verify(doctorRepository).save(any(DoctorProfile.class));
    }

    @Test
    void getDoctorDirectory_FiltersActiveOnly() {
        User activeUser = User.builder().status(Status.ACTIVE).build();
        User pendingUser = User.builder().status(Status.PENDING).build();

        DoctorProfile activeDoc = DoctorProfile.builder().user(activeUser).build();
        DoctorProfile pendingDoc = DoctorProfile.builder().user(pendingUser).build();

        when(doctorRepository.findAll()).thenReturn(List.of(activeDoc, pendingDoc));
        when(doctorMapper.toResponse(activeDoc)).thenReturn(new DoctorProfileResponse());

        List<DoctorProfileResponse> list = service.getDoctorDirectory();
        assertEquals(1, list.size());
    }

    @Test
    void getDoctorById_NotFound_ThrowsException() {
        when(doctorRepository.findByUserId(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getDoctorById(999L));
    }

    @Test
    void getDashboard_CalculatesMetrics() {
        User user = User.builder().firstName("Doctor").lastName("Who").build();
        DoctorProfile profile = DoctorProfile.builder().user(user).build();
        when(doctorRepository.findByUserId(10L)).thenReturn(Optional.of(profile));
        when(doctorPatientRepository.countByDoctorUserId(10L)).thenReturn(12L);

        Consultation c1 = Consultation.builder().consultationDate(java.time.LocalDateTime.now()).build();
        Consultation c2 = Consultation.builder().consultationDate(java.time.LocalDateTime.now().minusDays(1)).build();
        when(consultationRepository.findByDoctorUserIdOrderByConsultationDateDesc(10L)).thenReturn(List.of(c1, c2));
        when(notificationRepository.countByUserIdAndReadFalse(10L)).thenReturn(4L);

        DoctorDashboardResponse dash = service.getDashboard(10L);

        assertEquals(10L, dash.getDoctorId());
        assertEquals(12, dash.getTotalPatients());
        assertEquals(0, dash.getConsultationsToday());
        assertEquals(2, dash.getPendingReports());
        assertEquals(4, dash.getUnreadNotifications());
    }
}
