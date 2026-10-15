package com.nutrisphere.assignment;

import com.nutrisphere.assignment.dto.*;
import com.nutrisphere.exception.*;
import com.nutrisphere.patient.PatientRepository;
import com.nutrisphere.user.Role;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AssignmentService {
    private final DoctorPatientRepository doctorPatientRepo;
    private final DietitianPatientRepository dietitianPatientRepo;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private com.nutrisphere.doctor.DoctorRepository doctorRepository;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private com.nutrisphere.dietitian.DietitianRepository dietitianRepository;

    @Transactional
    public AssignmentResponse assignPatientToDoctor(Long doctorUserId, AssignPatientRequest req) {
        assertUserRole(doctorUserId, Role.DOCTOR);
        assertUserRole(req.getPatientUserId(), Role.PATIENT);
        if (doctorPatientRepo.existsByDoctorUserIdAndPatientUserId(doctorUserId, req.getPatientUserId())) {
            throw new DuplicateResourceException("Patient already assigned to this doctor");
        }
        var assignment = DoctorPatient.builder()
            .doctorUserId(doctorUserId)
            .patientUserId(req.getPatientUserId())
            .assignedDate(LocalDate.now())
            .notes(req.getNotes())
            .build();
        return toDoctorAssignmentResponse(doctorPatientRepo.save(assignment));
    }

    public List<AssignmentResponse> getDoctorPatients(Long doctorUserId) {
        return doctorPatientRepo.findByDoctorUserIdAndActiveTrue(doctorUserId)
            .stream().map(this::toDoctorAssignmentResponse).collect(Collectors.toList());
    }

    @Transactional
    public AssignmentResponse assignPatientToDietitian(Long dietitianUserId, AssignPatientRequest req) {
        assertUserRole(dietitianUserId, Role.DIETITIAN);
        assertUserRole(req.getPatientUserId(), Role.PATIENT);
        if (dietitianPatientRepo.existsByDietitianUserIdAndPatientUserId(dietitianUserId, req.getPatientUserId())) {
            throw new DuplicateResourceException("Patient already assigned to this dietitian");
        }
        var assignment = DietitianPatient.builder()
            .dietitianUserId(dietitianUserId)
            .patientUserId(req.getPatientUserId())
            .assignedDate(LocalDate.now())
            .notes(req.getNotes())
            .build();
        return toDietitianAssignmentResponse(dietitianPatientRepo.save(assignment));
    }

    public List<AssignmentResponse> getDietitianPatients(Long dietitianUserId) {
        return dietitianPatientRepo.findByDietitianUserIdAndActiveTrue(dietitianUserId)
            .stream().map(this::toDietitianAssignmentResponse).collect(Collectors.toList());
    }

    public List<AssignmentResponse> getPatientDoctors(Long patientUserId) {
        return doctorPatientRepo.findByPatientUserIdAndActiveTrue(patientUserId)
            .stream().map(this::toDoctorAssignmentResponse).collect(Collectors.toList());
    }

    public List<AssignmentResponse> getPatientDietitians(Long patientUserId) {
        return dietitianPatientRepo.findByPatientUserIdAndActiveTrue(patientUserId)
            .stream().map(this::toDietitianAssignmentResponse).collect(Collectors.toList());
    }

    @Transactional
    public AssignmentResponse assignPatientToDoctor(Long doctorUserId, Long patientUserId, String notes) {
        AssignPatientRequest req = new AssignPatientRequest();
        req.setPatientUserId(patientUserId);
        req.setNotes(notes);
        return assignPatientToDoctor(doctorUserId, req);
    }

    @Transactional
    public AssignmentResponse assignPatientToDietitian(Long dietitianUserId, Long patientUserId, String notes) {
        AssignPatientRequest req = new AssignPatientRequest();
        req.setPatientUserId(patientUserId);
        req.setNotes(notes);
        return assignPatientToDietitian(dietitianUserId, req);
    }

    private AssignmentResponse toDoctorAssignmentResponse(DoctorPatient a) {
        AssignmentResponse r = new AssignmentResponse();
        r.setId(a.getId());
        r.setPatientUserId(a.getPatientUserId());
        r.setDoctorUserId(a.getDoctorUserId());
        r.setAssignedDate(a.getAssignedDate());
        r.setActive(a.isActive());
        r.setNotes(a.getNotes());
        r.setStatus("STABLE");
        r.setActiveCondition("Clinical Nutrition Supervision");
        userRepository.findById(a.getPatientUserId()).ifPresent(u -> {
            r.setPatientName(u.getFullName());
            r.setPatientEmail(u.getEmail());
        });
        userRepository.findById(a.getDoctorUserId()).ifPresent(u -> {
            r.setDoctorName(u.getFullName());
        });
        if (doctorRepository != null) {
            doctorRepository.findByUserId(a.getDoctorUserId()).ifPresent(d -> {
                r.setDoctorSpecialization(d.getSpecialization());
            });
        }
        patientRepository.findByUserId(a.getPatientUserId()).ifPresent(p -> {
            if (p.getDateOfBirth() != null) {
                r.setAge(java.time.Period.between(p.getDateOfBirth(), LocalDate.now()).getYears());
            }
            if (p.getGender() != null) {
                r.setGender(p.getGender().name());
            }
            if (p.getWeightKg() != null) {
                r.setWeightKg(p.getWeightKg());
            }
            if (p.getHeightCm() != null) {
                r.setHeightCm(p.getHeightCm());
            }
            if (p.getAllergies() != null && !p.getAllergies().isBlank()) {
                r.setActiveCondition(p.getAllergies());
            }
        });
        dietitianPatientRepo.findByPatientUserIdAndActiveTrue(a.getPatientUserId()).stream().findFirst().ifPresent(dp -> {
            userRepository.findById(dp.getDietitianUserId()).ifPresent(u -> {
                r.setAssignedDietitian(u.getFullName());
            });
        });
        return r;
    }

    private void assertUserRole(Long userId, Role expectedRole) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (user.getRole() != expectedRole) {
            throw new ForbiddenException("User does not have the required role: " + expectedRole);
        }
    }

    private AssignmentResponse toDietitianAssignmentResponse(DietitianPatient a) {
        AssignmentResponse r = new AssignmentResponse();
        r.setId(a.getId());
        r.setPatientUserId(a.getPatientUserId());
        r.setDietitianUserId(a.getDietitianUserId());
        r.setAssignedDate(a.getAssignedDate());
        r.setActive(a.isActive());
        r.setNotes(a.getNotes());
        r.setStatus("ACTIVE");
        r.setActiveCondition("Therapeutic Nutrition Care");
        userRepository.findById(a.getPatientUserId()).ifPresent(u -> {
            r.setPatientName(u.getFullName());
            r.setPatientEmail(u.getEmail());
        });
        userRepository.findById(a.getDietitianUserId()).ifPresent(u -> {
            r.setDietitianName(u.getFullName());
        });
        if (dietitianRepository != null) {
            dietitianRepository.findByUserId(a.getDietitianUserId()).ifPresent(d -> {
                r.setDoctorSpecialization(d.getSpecialization());
            });
        }
        patientRepository.findByUserId(a.getPatientUserId()).ifPresent(p -> {
            if (p.getDateOfBirth() != null) {
                r.setAge(java.time.Period.between(p.getDateOfBirth(), LocalDate.now()).getYears());
            }
            if (p.getGender() != null) {
                r.setGender(p.getGender().name());
            }
            if (p.getWeightKg() != null) {
                r.setWeightKg(p.getWeightKg());
            }
            if (p.getHeightCm() != null) {
                r.setHeightCm(p.getHeightCm());
            }
            if (p.getAllergies() != null && !p.getAllergies().isBlank()) {
                r.setActiveCondition(p.getAllergies());
            }
        });
        doctorPatientRepo.findByPatientUserIdAndActiveTrue(a.getPatientUserId()).stream().findFirst().ifPresent(dp -> {
            userRepository.findById(dp.getDoctorUserId()).ifPresent(u -> {
                r.setAssignedDoctor(u.getFullName());
            });
        });
        return r;
    }
}
