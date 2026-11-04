package com.nutrisphere.nutrition.requirements;

import com.nutrisphere.common.enums.*;
import com.nutrisphere.nutrition.requirements.dto.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Transparent, validated clinical nutrition requirement calculation.
 * Combines Mifflin-St Jeor / Harris-Benedict BMR models with
 * ICMR-NIN 2020 Recommended Dietary Allowances (RDA) for Indian Adults,
 * dynamically adjusted for clinical conditions and laboratory deficiencies.
 */
@Component
public class RequirementCalculator {

    public RequirementResponse calculate(RequirementCalculationRequest req) {
        boolean isMale = req.getGender() == Gender.MALE;
        double weight = req.getWeightKg();
        double height = req.getHeightCm();
        int age = req.getAgeYears();

        // 1. Basal Metabolic Rate (BMR) Calculation
        double bmr;
        boolean useHarrisBenedict = "HARRIS_BENEDICT".equalsIgnoreCase(req.getFormula());
        
        if (useHarrisBenedict) {
            if (isMale) {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
        } else {
            if (isMale) {
                bmr = (10.0 * weight) + (6.25 * height) - (5.0 * age) + 5.0;
            } else {
                bmr = (10.0 * weight) + (6.25 * height) - (5.0 * age) - 161.0;
            }
        }

        // 2. Physical Activity Multiplier -> TDEE
        double actMult = switch (req.getActivityLevel()) {
            case SEDENTARY -> 1.2;
            case LIGHTLY_ACTIVE -> 1.375;
            case MODERATELY_ACTIVE -> 1.55;
            case VERY_ACTIVE -> 1.725;
            case EXTRA_ACTIVE -> 1.9;
        };

        double tdee = bmr * actMult;

        // 3. Goal Adjustment
        String goal = req.getGoal() != null ? req.getGoal().toUpperCase() : "MAINTENANCE";
        double targetCal = switch (goal) {
            case "FAT_LOSS", "WEIGHT_LOSS" -> tdee - 500.0;
            case "MILD_LOSS" -> tdee - 250.0;
            case "MUSCLE_GAIN", "MUSCLE_BUILD" -> tdee + 300.0;
            case "WEIGHT_GAIN" -> tdee + 500.0;
            default -> tdee;
        };

        targetCal = Math.max(1200.0, Math.min(4200.0, targetCal));

        // 4. Clinical Context Flags
        List<String> conditions = req.getConditions() != null ? req.getConditions() : new ArrayList<>();
        List<String> deficiencies = req.getDeficiencies() != null ? req.getDeficiencies() : new ArrayList<>();

        boolean hasDiabetes = conditions.stream().anyMatch(c -> c.toLowerCase().contains("diabetes") || c.toLowerCase().contains("glucose"));
        boolean hasPcos = conditions.stream().anyMatch(c -> c.toLowerCase().contains("pcos") || c.toLowerCase().contains("pcod"));
        boolean hasHypertension = conditions.stream().anyMatch(c -> c.toLowerCase().contains("hypertension") || c.toLowerCase().contains("blood pressure"));
        boolean hasCkd = conditions.stream().anyMatch(c -> c.toLowerCase().contains("ckd") || c.toLowerCase().contains("kidney") || c.toLowerCase().contains("renal"));
        boolean hasHyperlipidemia = conditions.stream().anyMatch(c -> c.toLowerCase().contains("cholesterol") || c.toLowerCase().contains("lipid") || c.toLowerCase().contains("ldl"));
        boolean hasHypothyroid = conditions.stream().anyMatch(c -> c.toLowerCase().contains("thyroid") || c.toLowerCase().contains("hypothyroid"));

        boolean hasVitDDeficiency = deficiencies.stream().anyMatch(d -> d.toLowerCase().contains("vitamin d") || d.toLowerCase().contains("25-oh"));
        boolean hasB12Deficiency = deficiencies.stream().anyMatch(d -> d.toLowerCase().contains("b12") || d.toLowerCase().contains("cobalamin"));
        boolean hasIronDeficiency = deficiencies.stream().anyMatch(d -> d.toLowerCase().contains("iron") || d.toLowerCase().contains("ferritin") || d.toLowerCase().contains("anemia"));

        // 5. Macronutrient Calculation
        // Protein: adjusted for renal safety (0.6 - 0.8g/kg), PCOS/loss (1.5 - 1.6g/kg), muscle gain (1.8 - 2.0g/kg), baseline (1.2g/kg)
        double proteinMultiplier = 1.2;
        if (hasCkd) {
            proteinMultiplier = 0.8; // Renal clinical constraint
        } else if (goal.contains("MUSCLE") || req.getActivityLevel() == ActivityLevel.VERY_ACTIVE || req.getActivityLevel() == ActivityLevel.EXTRA_ACTIVE) {
            proteinMultiplier = 1.8;
        } else if (hasPcos || goal.contains("LOSS")) {
            proteinMultiplier = 1.5;
        }

        double proteinG = Math.round(weight * proteinMultiplier * 10.0) / 10.0;
        double proteinCalories = proteinG * 4.0;

        // Fats: 25% - 30% of energy
        double fatPercent = 0.26;
        if (hasHyperlipidemia) fatPercent = 0.22;
        else if (hasPcos) fatPercent = 0.29; // Healthy fats for hormonal synthesis

        double fatG = Math.round(((targetCal * fatPercent) / 9.0) * 10.0) / 10.0;
        double fatCalories = fatG * 9.0;

        // Detailed Fat Breakdown
        double satFatMax = Math.round(((targetCal * (hasHyperlipidemia ? 0.06 : 0.08)) / 9.0) * 10.0) / 10.0; // < 6-8% of calories
        double mufaG = Math.round((fatG * 0.50) * 10.0) / 10.0; // ~50% of fats from MUFA (Mustard, Groundnut, Til, Olive)
        double pufaG = Math.round((fatG * 0.28) * 10.0) / 10.0; // ~28% of fats from PUFA

        // Carbohydrates: remaining calories
        double remainingCalories = Math.max(400.0, targetCal - proteinCalories - fatCalories);
        double carbsG = Math.round((remainingCalories / 4.0) * 10.0) / 10.0;

        // Dietary Fibre: baseline 28g; therapeutic 35-40g for glycemic/PCOS/lipid management
        double fiberG = (hasDiabetes || hasPcos || hasHyperlipidemia) ? 38.0 : 28.0;

        // Added Sugar: restricted to 0g for diabetic/PCOS, <20g for baseline
        double addedSugarG = (hasDiabetes || hasPcos) ? 0.0 : 18.0;

        // Hydration: weight * 35ml + activity bonus
        double waterBonus = (req.getActivityLevel() == ActivityLevel.VERY_ACTIVE || req.getActivityLevel() == ActivityLevel.EXTRA_ACTIVE) ? 600.0 : 300.0;
        double waterMl = Math.round((weight * 35.0 + waterBonus) / 50.0) * 50.0;

        // 6. Micronutrient Calculation (ICMR-NIN 2020 RDA & Clinical Therapeutic Adjustments)
        
        // Vitamins
        double vitA = isMale ? 1000.0 : 840.0;     // mcg RAE
        double vitB1 = isMale ? 1.8 : 1.4;         // mg
        double vitB2 = isMale ? 2.0 : 1.6;         // mg
        double vitB3 = isMale ? 18.0 : 14.0;       // mg
        double vitB5 = 5.0;                        // mg
        double vitB6 = isMale ? 2.4 : 1.9;         // mg
        double vitB7 = 35.0;                       // mcg
        double vitB9 = isMale ? 300.0 : 250.0;     // mcg (Folate)
        if (hasPcos) vitB9 = 400.0; // Folate enhancement for ovulatory health

        // Vitamin B12: RDA is 2.5 mcg; therapeutic protocol if deficient is 500 - 1000 mcg
        double vitB12 = hasB12Deficiency ? 500.0 : 2.5; // mcg

        // Vitamin C: RDA is 80mg; therapeutic boost to 120mg if iron deficient (synergistic bioavailability)
        double vitC = hasIronDeficiency ? 120.0 : 80.0; // mg

        // Vitamin D: RDA is 15 mcg (600 IU); therapeutic repletion protocol is 50-75 mcg (2000-3000 IU)
        double vitD = hasVitDDeficiency ? 50.0 : 15.0; // mcg

        double vitE = isMale ? 10.0 : 7.5;         // mg
        double vitK = isMale ? 65.0 : 55.0;        // mcg

        // Minerals
        double calcium = 1000.0;                   // mg
        
        // Iron: ICMR RDA is 19mg (male), 29mg (menstruating female); therapeutic boost if deficient
        double iron = isMale ? 19.0 : 29.0;        // mg
        if (hasIronDeficiency) iron = Math.min(45.0, iron + 10.0);

        double magnesium = isMale ? 440.0 : 370.0; // mg
        double zinc = isMale ? 17.0 : 13.0;        // mg

        // Potassium: 3500 mg baseline; careful monitoring if CKD
        double potassium = hasCkd ? 2200.0 : 3500.0; // mg

        // Sodium: 2000 mg baseline; restricted to 1500 mg for DASH hypertension protocol
        double sodium = hasHypertension ? 1500.0 : 2000.0; // mg

        // Phosphorus: 1000 mg baseline; restricted to 700 mg for CKD
        double phosphorus = hasCkd ? 700.0 : 1000.0; // mg

        double selenium = 40.0;                    // mcg
        double iodine = 150.0;                     // mcg
        double copper = 1.7;                       // mg

        // Omega-3 Fatty Acids
        double omega3 = (hasHyperlipidemia || hasPcos || hasDiabetes) ? 1.6 : 1.2; // g

        // 7. Clinical Rationale & Explanations Construction
        StringBuilder rationale = new StringBuilder();
        rationale.append("Precision Target: ").append((int) targetCal).append(" kcal/day (BMR: ")
                 .append(Math.round(bmr)).append(" kcal, TDEE: ").append(Math.round(tdee)).append(" kcal). ");

        if (hasCkd) {
            rationale.append("Renal protocol active: Protein restricted to 0.8 g/kg with phosphorus (<")
                     .append((int) phosphorus).append("mg) and potassium monitored for nephron preservation. ");
        } else if (hasDiabetes || hasPcos) {
            rationale.append("Low glycemic index load with enhanced soluble fiber (")
                     .append((int) fiberG).append("g) to attenuate postprandial glucose surges and improve insulin sensitivity. ");
        }

        if (hasHypertension) {
            rationale.append("DASH cardiovascular protocol: Sodium restricted to <")
                     .append((int) sodium).append("mg paired with high dietary potassium and magnesium. ");
        }

        if (hasVitDDeficiency) {
            rationale.append("Vitamin D3 therapeutic repletion protocol (")
                     .append((int) (vitD * 40)).append(" IU / ")
                     .append((int) vitD).append(" mcg) to normalize serum 25-OH levels. ");
        }

        if (hasB12Deficiency) {
            rationale.append("Vitamin B12 clinical repletion protocol (")
                     .append((int) vitB12).append(" mcg) for erythrocyte maturation and homocysteine regulation. ");
        }

        if (hasIronDeficiency) {
            rationale.append("Iron bioavailability enhancement: Elemental iron increased to ")
                     .append((int) iron).append("mg paired with synergistic Vitamin C (")
                     .append((int) vitC).append("mg). ");
        }

        // 8. Abnormal Flags & Data Gaps Audit
        List<String> abnormalFlags = new ArrayList<>();
        if (hasHypertension) abnormalFlags.add("Elevated Blood Pressure: DASH sodium constraint applied");
        if (hasDiabetes) abnormalFlags.add("Elevated Glycemic Marker: Low GI & added sugar elimination enforced");
        if (hasCkd) abnormalFlags.add("Renal Impairment: Clinical protein ceiling strictly enforced (0.8 g/kg)");
        if (hasVitDDeficiency) abnormalFlags.add("Active Vitamin D3 Insufficiency (<30 ng/mL) flagged for therapeutic diet");
        if (hasB12Deficiency) abnormalFlags.add("Active Vitamin B12 Deficiency (<250 pg/mL) flagged for therapeutic diet");
        if (hasIronDeficiency) abnormalFlags.add("Active Iron / Ferritin Deficiency flagged for absorption pairing");

        List<String> dataGaps = new ArrayList<>();
        if (deficiencies.isEmpty()) {
            dataGaps.add("No recent comprehensive blood panel on file. Upload lab report for therapeutic micronutrient calibration.");
        }
        if (req.getActivityLevel() == ActivityLevel.SEDENTARY) {
            dataGaps.add("Low physical activity reported. Daily progressive stepping or light aerobic exercise recommended.");
        }

        RequirementResponse resp = new RequirementResponse();
        resp.setBmr(Math.round(bmr * 10.0) / 10.0);
        resp.setTdee(Math.round(tdee * 10.0) / 10.0);
        resp.setCaloriesTarget((double) Math.round(targetCal));
        resp.setProteinGTarget(proteinG);
        resp.setCarbsGTarget(carbsG);
        resp.setFatGTarget(fatG);
        resp.setFiberGTarget(fiberG);
        resp.setWaterMlTarget(waterMl);
        resp.setCalculationMethod(useHarrisBenedict ? "Harris-Benedict + ICMR-NIN RDA" : "Mifflin-St Jeor + ICMR-NIN RDA");
        resp.setNotes(rationale.toString());
        resp.setActive(true);

        // Detailed Macronutrients
        resp.setSaturatedFatGTarget(satFatMax);
        resp.setMonounsaturatedFatGTarget(mufaG);
        resp.setPolyunsaturatedFatGTarget(pufaG);
        resp.setAddedSugarGTarget(addedSugarG);

        // Vitamins
        resp.setVitaminA(vitA);
        resp.setVitaminB1(vitB1);
        resp.setVitaminB2(vitB2);
        resp.setVitaminB3(vitB3);
        resp.setVitaminB5(vitB5);
        resp.setVitaminB6(vitB6);
        resp.setVitaminB7(vitB7);
        resp.setVitaminB9(vitB9);
        resp.setVitaminB12(vitB12);
        resp.setVitaminC(vitC);
        resp.setVitaminD(vitD);
        resp.setVitaminE(vitE);
        resp.setVitaminK(vitK);

        // Minerals
        resp.setCalcium(calcium);
        resp.setIron(iron);
        resp.setMagnesium(magnesium);
        resp.setZinc(zinc);
        resp.setPotassium(potassium);
        resp.setSodium(sodium);
        resp.setPhosphorus(phosphorus);
        resp.setSelenium(selenium);
        resp.setIodine(iodine);
        resp.setCopper(copper);

        // Other Parameters
        resp.setOmega3GTarget(omega3);

        // Explanations & Audit
        resp.setClinicalRationale(rationale.toString());
        resp.setIdentifiedDeficiencies(deficiencies);
        resp.setDataGaps(dataGaps);
        resp.setAbnormalFlags(abnormalFlags);
        resp.setRequiresDietitianApproval(true);

        return resp;
    }
}
