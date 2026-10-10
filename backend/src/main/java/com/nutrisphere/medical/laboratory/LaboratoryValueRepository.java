package com.nutrisphere.medical.laboratory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LaboratoryValueRepository extends JpaRepository<LaboratoryValue, Long> {
    List<LaboratoryValue> findByReportId(Long reportId);
}
