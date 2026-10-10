package com.nutrisphere.medical.laboratory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LaboratoryReportRepository extends JpaRepository<LaboratoryReport, Long> {
    List<LaboratoryReport> findByPatientUserIdOrderByReportDateDesc(Long patientUserId);
    List<LaboratoryReport> findByDoctorUserIdOrderByReportDateDesc(Long doctorUserId);
}
