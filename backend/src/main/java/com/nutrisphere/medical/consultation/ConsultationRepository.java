package com.nutrisphere.medical.consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatientUserIdOrderByConsultationDateDesc(Long patientUserId);
    List<Consultation> findByDoctorUserIdOrderByConsultationDateDesc(Long doctorUserId);
}
