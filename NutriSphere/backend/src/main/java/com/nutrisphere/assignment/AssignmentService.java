package com.nutrisphere.assignment;

import com.nutrisphere.assignment.dto.*;
import com.nutrisphere.exception.*;
import com.nutrisphere.patient.PatientRepository;
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

    @Transactional
    public AssignmentResponse assignPatientToDoctor(Long doctorUserId, AssignPatientRequest req) {
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

    private AssignmentResponse toDoctorAssignmentResponse(DoctorPatient a) {
        AssignmentResponse r = new AssignmentResponse();
        r.setId(a.getId());
        r.setPatientUserId(a.getPatientUserId());
        r.setAssignedDate(a.getAssignedDate());
        r.setActive(a.isActive());
        r.setNotes(a.getNotes());
        userRepository.findById(a.getPatientUserId()).ifPresent(u -> {
            r.setPatientName(u.getFullName());
            r.setPatientEmail(u.getEmail());
        });
        return r;
    }

    private AssignmentResponse toDietitianAssignmentResponse(DietitianPatient a) {
        AssignmentResponse r = new AssignmentResponse();
        r.setId(a.getId());
        r.setPatientUserId(a.getPatientUserId());
        r.setAssignedDate(a.getAssignedDate());
        r.setActive(a.isActive());
        r.setNotes(a.getNotes());
        userRepository.findById(a.getPatientUserId()).ifPresent(u -> {
            r.setPatientName(u.getFullName());
            r.setPatientEmail(u.getEmail());
        });
        return r;
    }
}
