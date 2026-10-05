package com.nutrisphere.medical.history;

import com.nutrisphere.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalHistoryService {
    private final MedicalHistoryRepository repo;

    public List<MedicalHistory> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByDiagnosisDateDesc(patientUserId);
    }

    public MedicalHistory getById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("MedicalHistory", id));
    }

    @Transactional
    public MedicalHistory create(MedicalHistory history) {
        return repo.save(history);
    }

    @Transactional
    public MedicalHistory update(Long id, MedicalHistory updates) {
        MedicalHistory existing = getById(id);
        if (updates.getConditionName() != null) existing.setConditionName(updates.getConditionName());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getDiagnosisDate() != null) existing.setDiagnosisDate(updates.getDiagnosisDate());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getTreatment() != null) existing.setTreatment(updates.getTreatment());
        if (updates.getMedications() != null) existing.setMedications(updates.getMedications());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
