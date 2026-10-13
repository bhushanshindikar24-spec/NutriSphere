package com.nutrisphere.assignment;

import com.nutrisphere.assignment.dto.AssignPatientRequest;
import com.nutrisphere.assignment.dto.AssignmentResponse;
import com.nutrisphere.exception.DuplicateResourceException;
import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.patient.PatientRepository;
import com.nutrisphere.user.Role;
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
class AssignmentServiceTest {

    @Mock
    private DoctorPatientRepository doctorPatientRepo;
    @Mock
    private DietitianPatientRepository dietitianPatientRepo;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PatientRepository patientRepository;

    private AssignmentService service;

    @BeforeEach
    void setUp() {
        service = new AssignmentService(
            doctorPatientRepo,
            dietitianPatientRepo,
            userRepository,
            patientRepository
        );
    }

    @Test
    void assignPatientToDoctor_Success() {
        User doc = User.builder().role(Role.DOCTOR).firstName("Doc").lastName("A").email("doc@a.com").build();
        doc.setId(10L);
        User patient = User.builder().role(Role.PATIENT).firstName("Pat").lastName("B").email("pat@b.com").build();
        patient.setId(20L);

        when(userRepository.findById(10L)).thenReturn(Optional.of(doc));
        when(userRepository.findById(20L)).thenReturn(Optional.of(patient));
        when(doctorPatientRepo.existsByDoctorUserIdAndPatientUserId(10L, 20L)).thenReturn(false);

        DoctorPatient assignment = DoctorPatient.builder()
            .doctorUserId(10L)
            .patientUserId(20L)
            .assignedDate(LocalDate.now())
            .active(true)
            .build();
        assignment.setId(1L);

        when(doctorPatientRepo.save(any(DoctorPatient.class))).thenReturn(assignment);

        AssignPatientRequest req = new AssignPatientRequest();
        req.setPatientUserId(20L);
        req.setNotes("Initial assignment");

        AssignmentResponse res = service.assignPatientToDoctor(10L, req);

        assertNotNull(res);
        assertEquals(1L, res.getId());
        assertEquals(10L, res.getDoctorUserId());
        assertEquals(20L, res.getPatientUserId());
        assertEquals("Pat B", res.getPatientName());
    }

    @Test
    void assignPatientToDoctor_WrongRole_ThrowsForbiddenException() {
        User notDoc = User.builder().role(Role.PATIENT).build();
        notDoc.setId(10L);

        when(userRepository.findById(10L)).thenReturn(Optional.of(notDoc));

        AssignPatientRequest req = new AssignPatientRequest();
        req.setPatientUserId(20L);

        assertThrows(ForbiddenException.class, () -> service.assignPatientToDoctor(10L, req));
    }

    @Test
    void assignPatientToDoctor_AlreadyAssigned_ThrowsDuplicateResourceException() {
        User doc = User.builder().role(Role.DOCTOR).build();
        User patient = User.builder().role(Role.PATIENT).build();

        when(userRepository.findById(10L)).thenReturn(Optional.of(doc));
        when(userRepository.findById(20L)).thenReturn(Optional.of(patient));
        when(doctorPatientRepo.existsByDoctorUserIdAndPatientUserId(10L, 20L)).thenReturn(true);

        AssignPatientRequest req = new AssignPatientRequest();
        req.setPatientUserId(20L);

        assertThrows(DuplicateResourceException.class, () -> service.assignPatientToDoctor(10L, req));
    }

    @Test
    void assignPatientToDietitian_SuccessAndDuplicateCheck() {
        User diet = User.builder().role(Role.DIETITIAN).firstName("Diet").lastName("C").build();
        diet.setId(30L);
        User patient = User.builder().role(Role.PATIENT).firstName("Pat").lastName("D").build();
        patient.setId(40L);

        when(userRepository.findById(30L)).thenReturn(Optional.of(diet));
        when(userRepository.findById(40L)).thenReturn(Optional.of(patient));
        when(dietitianPatientRepo.existsByDietitianUserIdAndPatientUserId(30L, 40L)).thenReturn(false);

        DietitianPatient assignment = DietitianPatient.builder()
            .dietitianUserId(30L)
            .patientUserId(40L)
            .assignedDate(LocalDate.now())
            .active(true)
            .build();
        assignment.setId(2L);

        when(dietitianPatientRepo.save(any(DietitianPatient.class))).thenReturn(assignment);

        AssignPatientRequest req = new AssignPatientRequest();
        req.setPatientUserId(40L);

        AssignmentResponse res = service.assignPatientToDietitian(30L, req);
        assertNotNull(res);
        assertEquals(2L, res.getId());

        // Duplicate
        when(dietitianPatientRepo.existsByDietitianUserIdAndPatientUserId(30L, 40L)).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> service.assignPatientToDietitian(30L, req));
    }

    @Test
    void queryMethods_ReturnMappedAssignments() {
        DoctorPatient dp = DoctorPatient.builder().doctorUserId(10L).patientUserId(20L).active(true).build();
        dp.setId(1L);
        DietitianPatient dkp = DietitianPatient.builder().dietitianUserId(30L).patientUserId(20L).active(true).build();
        dkp.setId(2L);

        when(doctorPatientRepo.findByDoctorUserIdAndActiveTrue(10L)).thenReturn(List.of(dp));
        when(dietitianPatientRepo.findByDietitianUserIdAndActiveTrue(30L)).thenReturn(List.of(dkp));
        when(doctorPatientRepo.findByPatientUserIdAndActiveTrue(20L)).thenReturn(List.of(dp));
        when(dietitianPatientRepo.findByPatientUserIdAndActiveTrue(20L)).thenReturn(List.of(dkp));

        assertEquals(1, service.getDoctorPatients(10L).size());
        assertEquals(1, service.getDietitianPatients(30L).size());
        assertEquals(1, service.getPatientDoctors(20L).size());
        assertEquals(1, service.getPatientDietitians(20L).size());
    }
}
