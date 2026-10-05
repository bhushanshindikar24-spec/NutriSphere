package com.nutrisphere.medical.laboratory;

import com.nutrisphere.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LaboratoryService {
    private final LaboratoryReportRepository reportRepo;
    private final LaboratoryValueRepository valueRepo;

    public List<LaboratoryReport> getForPatient(Long patientUserId) {
        return reportRepo.findByPatientUserIdOrderByReportDateDesc(patientUserId);
    }

    public LaboratoryReport getById(Long id) {
        return reportRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("LaboratoryReport", id));
    }

    public List<LaboratoryValue> getValues(Long reportId) {
        return valueRepo.findByReportId(reportId);
    }

    @Transactional
    public LaboratoryReport create(LaboratoryReport report) {
        return reportRepo.save(report);
    }

    @Transactional
    public LaboratoryValue addValue(LaboratoryValue value) {
        return valueRepo.save(value);
    }

    @Transactional
    public LaboratoryReport update(Long id, LaboratoryReport updates) {
        LaboratoryReport existing = getById(id);
        if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
        if (updates.getReportDate() != null) existing.setReportDate(updates.getReportDate());
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        return reportRepo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        reportRepo.deleteById(id);
    }
}
