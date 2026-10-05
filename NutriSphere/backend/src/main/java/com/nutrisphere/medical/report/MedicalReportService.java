package com.nutrisphere.medical.report;

import com.nutrisphere.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.nutrisphere.exception.ForbiddenException;

@Service
@RequiredArgsConstructor
public class MedicalReportService {
    private final MedicalReportRepository repo;

    public List<MedicalReport> getForPatient(Long patientUserId, Long currentUserId, boolean isPatient) {
        if (isPatient && !patientUserId.equals(currentUserId)) {
            throw new ForbiddenException("Cannot view other patient's reports");
        }
        return repo.findByPatientUserIdOrderByReportDateDesc(patientUserId);
    }

    public MedicalReport getById(Long id, Long currentUserId, boolean isPatient) {
        MedicalReport report = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("MedicalReport", id));
        if (isPatient && !report.getPatientUserId().equals(currentUserId)) {
            throw new ForbiddenException("Not your medical report");
        }
        return report;
    }

    @Transactional
    public MedicalReport create(MedicalReport report) {
        return repo.save(report);
    }

    @Transactional
    public MedicalReport update(Long id, MedicalReport updates, Long currentUserId, boolean isPatient) {
        MedicalReport existing = getById(id, currentUserId, isPatient);
        if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
        if (updates.getReportDate() != null) existing.setReportDate(updates.getReportDate());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());
        if (updates.getReportType() != null) existing.setReportType(updates.getReportType());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id, Long currentUserId, boolean isPatient) {
        MedicalReport existing = getById(id, currentUserId, isPatient);
        repo.delete(existing);
    }
}
