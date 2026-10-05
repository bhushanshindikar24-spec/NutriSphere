package com.nutrisphere.medical.consultation;

import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRepository repo;
    private final NotificationService notificationService;

    public List<Consultation> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByConsultationDateDesc(patientUserId);
    }

    public List<Consultation> getByDoctor(Long doctorUserId) {
        return repo.findByDoctorUserIdOrderByConsultationDateDesc(doctorUserId);
    }

    public Consultation getById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Consultation", id));
    }

    @Transactional
    public Consultation create(Consultation consultation) {
        Consultation saved = repo.save(consultation);
        notificationService.createNotification(
            consultation.getPatientUserId(),
            "CONSULTATION",
            "New Consultation Added",
            "Your doctor has added a new consultation record.",
            saved.getId()
        );
        return saved;
    }

    @Transactional
    public Consultation update(Long id, Consultation updates) {
        Consultation existing = getById(id);
        if (updates.getChiefComplaint() != null) existing.setChiefComplaint(updates.getChiefComplaint());
        if (updates.getDiagnosis() != null) existing.setDiagnosis(updates.getDiagnosis());
        if (updates.getTreatmentPlan() != null) existing.setTreatmentPlan(updates.getTreatmentPlan());
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());
        if (updates.getFollowUpDate() != null) existing.setFollowUpDate(updates.getFollowUpDate());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
