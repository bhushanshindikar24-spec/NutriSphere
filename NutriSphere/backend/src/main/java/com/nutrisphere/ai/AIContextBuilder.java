package com.nutrisphere.ai;

import com.nutrisphere.medical.condition.PatientConditionRepository;
import com.nutrisphere.nutrition.requirements.RequirementRepository;
import com.nutrisphere.patient.PatientProfile;
import com.nutrisphere.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AIContextBuilder {

    private final PatientRepository patientRepo;
    private final PatientConditionRepository conditionRepo;
    private final RequirementRepository requirementRepo;
    private final com.nutrisphere.intelligence.digitaltwin.DigitalTwinService digitalTwinService;

    public String buildContextForPatient(Long patientUserId) {
        if (patientUserId == null) {
            return "General nutrition query (no specific patient).";
        }

        StringBuilder sb = new StringBuilder();
        patientRepo.findByUserId(patientUserId).ifPresent(p -> {
            sb.append("Patient Gender: ").append(p.getGender())
              .append(", Height: ").append(p.getHeightCm()).append("cm, Weight: ").append(p.getWeightKg()).append("kg\n");
            if (p.getAllergies() != null && !p.getAllergies().isBlank()) {
                sb.append("Allergies: ").append(p.getAllergies()).append("\n");
            }
            if (p.getDietaryRestrictions() != null && !p.getDietaryRestrictions().isBlank()) {
                sb.append("Dietary Restrictions: ").append(p.getDietaryRestrictions()).append("\n");
            }
            if (p.getFoodPreferences() != null && !p.getFoodPreferences().isBlank()) {
                sb.append("Food Preferences: ").append(p.getFoodPreferences()).append("\n");
            }
        });

        var conditions = conditionRepo.findByPatientUserId(patientUserId);
        if (conditions != null && !conditions.isEmpty()) {
            sb.append("Health Conditions: ");
            conditions.forEach(c -> sb.append(c.getConditionName()).append(" (").append(c.getSeverity() != null ? c.getSeverity() : "active").append("); "));
            sb.append("\n");
        }

        var reqOpt = requirementRepo.findFirstByPatientUserIdAndActiveTrue(patientUserId);
        reqOpt.ifPresent(r -> {
            sb.append("Active Caloric Target: ").append(r.getCaloriesTarget()).append(" kcal/day, Protein: ")
              .append(r.getProteinGTarget()).append("g, Carbs: ").append(r.getCarbsGTarget()).append("g, Fat: ")
              .append(r.getFatGTarget()).append("g\n");
        });

        try {
            var twin = digitalTwinService.buildDigitalTwin(patientUserId);
            if (twin != null) {
                sb.append("\n[Digital Twin - Recent 7-Day Analytics]\n");
                sb.append("Average Daily Intake: ").append(String.format("%.0f", twin.getAvgDailyCalories())).append(" kcal (Adherence: ")
                  .append(String.format("%.1f%%", twin.getAdherencePercent())).append(")\n");
                sb.append("Average Macros: Protein ").append(String.format("%.1fg", twin.getAvgDailyProteinG()))
                  .append(", Carbs ").append(String.format("%.1fg", twin.getAvgDailyCarbsG()))
                  .append(", Fat ").append(String.format("%.1fg", twin.getAvgDailyFatG())).append("\n");
                sb.append("Average Hydration: ").append(String.format("%.0f ml/day\n", twin.getAvgDailyWaterMl()));
                sb.append("Reality Score: ").append(twin.getLatestRealityScore()).append(" (").append(twin.getRealityScoreInterpretation()).append(")\n");
                if (twin.getDominantBarrier() != null) {
                    sb.append("Dominant Adherence Barrier: ").append(twin.getDominantBarrier()).append("\n");
                }
            }
        } catch (Exception e) {
            // Twin data unavailable
        }

        return sb.toString();
    }
}
