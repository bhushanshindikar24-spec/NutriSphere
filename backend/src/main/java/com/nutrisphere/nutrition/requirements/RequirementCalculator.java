package com.nutrisphere.nutrition.requirements;

import com.nutrisphere.common.enums.*;
import com.nutrisphere.nutrition.requirements.dto.*;
import org.springframework.stereotype.Component;

/**
 * Transparent nutrition requirement calculation.
 * Uses Mifflin-St Jeor equation for BMR.
 * Formula is documented.
 */
@Component
public class RequirementCalculator {

    public RequirementResponse calculate(RequirementCalculationRequest req) {
        // BMR Calculation: Mifflin-St Jeor (Default) or Harris-Benedict per Specification Section 7
        double bmr;
        boolean useHarrisBenedict = "HARRIS_BENEDICT".equalsIgnoreCase(req.getFormula());
        
        if (useHarrisBenedict) {
            if (req.getGender() == Gender.MALE) {
                bmr = 88.362 + (13.397 * req.getWeightKg()) + (4.799 * req.getHeightCm()) - (5.677 * req.getAgeYears());
            } else {
                bmr = 447.593 + (9.247 * req.getWeightKg()) + (3.098 * req.getHeightCm()) - (4.330 * req.getAgeYears());
            }
        } else {
            if (req.getGender() == Gender.MALE) {
                bmr = (10 * req.getWeightKg()) + (6.25 * req.getHeightCm()) - (5 * req.getAgeYears()) + 5;
            } else {
                bmr = (10 * req.getWeightKg()) + (6.25 * req.getHeightCm()) - (5 * req.getAgeYears()) - 161;
            }
        }

        // Activity multiplier
        double actMult = switch (req.getActivityLevel()) {
            case SEDENTARY -> 1.2;
            case LIGHTLY_ACTIVE -> 1.375;
            case MODERATELY_ACTIVE -> 1.55;
            case VERY_ACTIVE -> 1.725;
            case EXTRA_ACTIVE -> 1.9;
        };

        double tdee = bmr * actMult;

        // Goal adjustment
        double targetCal = switch (req.getGoal() != null ? req.getGoal() : "MAINTENANCE") {
            case "WEIGHT_LOSS" -> tdee - 500;
            case "MUSCLE_GAIN" -> tdee + 300;
            default -> tdee;
        };

        targetCal = Math.max(1200, Math.min(4000, targetCal));

        // Macros (balanced)
        double proteinG = req.getWeightKg() * 1.2; // 1.2g per kg
        double fatG = (targetCal * 0.25) / 9;      // 25% from fat
        double carbsG = (targetCal - (proteinG * 4) - (fatG * 9)) / 4;

        RequirementResponse r = new RequirementResponse();
        r.setBmr(Math.round(bmr * 10.0) / 10.0);
        r.setTdee(Math.round(tdee * 10.0) / 10.0);
        r.setCaloriesTarget((double) Math.round(targetCal));
        r.setProteinGTarget(Math.round(proteinG * 10.0) / 10.0);
        r.setCarbsGTarget(Math.round(carbsG * 10.0) / 10.0);
        r.setFatGTarget(Math.round(fatG * 10.0) / 10.0);
        r.setFiberGTarget(25.0);
        r.setWaterMlTarget(req.getWeightKg() * 35); // 35ml per kg
        r.setCalculationMethod(useHarrisBenedict ? "Harris-Benedict + Activity Factor" : "Mifflin-St Jeor + Activity Factor");
        return r;
    }
}
