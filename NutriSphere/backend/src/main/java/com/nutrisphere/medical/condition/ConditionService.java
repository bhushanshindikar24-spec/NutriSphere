package com.nutrisphere.medical.condition;

import com.nutrisphere.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConditionService {
    private final HealthConditionRepository healthConditionRepo;
    private final PatientConditionRepository patientConditionRepo;

    public List<HealthCondition> getAllHealthConditions() {
        return healthConditionRepo.findByActiveTrue();
    }

    public List<PatientCondition> getPatientConditions(Long patientUserId) {
        return patientConditionRepo.findByPatientUserIdAndActiveTrue(patientUserId);
    }

    @Transactional
    public PatientCondition addConditionToPatient(PatientCondition condition) {
        return patientConditionRepo.save(condition);
    }

    @Transactional
    public void removePatientCondition(Long conditionId) {
        PatientCondition pc = patientConditionRepo.findById(conditionId)
            .orElseThrow(() -> new ResourceNotFoundException("PatientCondition", conditionId));
        pc.setActive(false);
        patientConditionRepo.save(pc);
    }

    @Transactional
    public HealthCondition createHealthCondition(HealthCondition condition) {
        return healthConditionRepo.save(condition);
    }
}
