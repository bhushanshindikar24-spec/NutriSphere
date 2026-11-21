package com.nutrisphere.nutrition.requirements;

import com.nutrisphere.common.enums.ActivityLevel;
import com.nutrisphere.common.enums.Gender;
import com.nutrisphere.nutrition.requirements.dto.RequirementCalculationRequest;
import com.nutrisphere.nutrition.requirements.dto.RequirementResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RequirementCalculatorTest {

    private RequirementCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new RequirementCalculator();
    }

    @Test
    void calculate_MifflinStJeor_Male_ModeratelyActive_Maintenance() {
        RequirementCalculationRequest req = new RequirementCalculationRequest();
        req.setGender(Gender.MALE);
        req.setWeightKg(70.0);
        req.setHeightCm(175.0);
        req.setAgeYears(25);
        req.setActivityLevel(ActivityLevel.MODERATELY_ACTIVE);
        req.setGoal("MAINTENANCE");

        RequirementResponse res = calculator.calculate(req);

        // BMR = (10 * 70) + (6.25 * 175) - (5 * 25) + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1673.8
        assertEquals(1673.8, res.getBmr());
        // TDEE = 1673.75 * 1.55 = 2594.3125 -> 2594.3
        assertEquals(2594.3, res.getTdee());
        assertEquals(2594.0, res.getCaloriesTarget());
        // Protein = 70 * 1.2 = 84.0g
        assertEquals(84.0, res.getProteinGTarget());
        // Water = round50(70 * 35 + 300 activity bonus) = 2750.0ml
        assertEquals(2750.0, res.getWaterMlTarget());
        assertTrue(res.getCalculationMethod().contains("Mifflin-St Jeor"));
    }

    @Test
    void calculate_MifflinStJeor_Female_Sedentary_WeightLoss() {
        RequirementCalculationRequest req = new RequirementCalculationRequest();
        req.setGender(Gender.FEMALE);
        req.setWeightKg(60.0);
        req.setHeightCm(160.0);
        req.setAgeYears(30);
        req.setActivityLevel(ActivityLevel.SEDENTARY); // 1.2
        req.setGoal("WEIGHT_LOSS"); // -500 cal

        RequirementResponse res = calculator.calculate(req);

        // BMR = (10 * 60) + (6.25 * 160) - (5 * 30) - 161 = 600 + 1000 - 150 - 161 = 1289.0
        assertEquals(1289.0, res.getBmr());
        // TDEE = 1289.0 * 1.2 = 1546.8
        assertEquals(1546.8, res.getTdee());
        // Target = 1546.8 - 500 = 1046.8 -> clamped to min 1200
        assertEquals(1200.0, res.getCaloriesTarget());
        // Weight-loss goal uses 1.5 g/kg protein: 60 * 1.5 = 90.0g
        assertEquals(90.0, res.getProteinGTarget());
    }

    @Test
    void calculate_HarrisBenedict_Male_VeryActive_MuscleGain() {
        RequirementCalculationRequest req = new RequirementCalculationRequest();
        req.setFormula("HARRIS_BENEDICT");
        req.setGender(Gender.MALE);
        req.setWeightKg(80.0);
        req.setHeightCm(180.0);
        req.setAgeYears(28);
        req.setActivityLevel(ActivityLevel.VERY_ACTIVE); // 1.725
        req.setGoal("MUSCLE_GAIN"); // +300 cal

        RequirementResponse res = calculator.calculate(req);

        // Harris-Benedict Male: 88.362 + (13.397 * 80) + (4.799 * 180) - (5.677 * 28)
        assertTrue(res.getBmr() > 1700);
        assertTrue(res.getTdee() > 3000);
        assertTrue(res.getCaloriesTarget() > 3300);
        assertTrue(res.getCalculationMethod().contains("Harris-Benedict"));
    }

    @Test
    void calculate_ClampedToMax4200Calories() {
        RequirementCalculationRequest req = new RequirementCalculationRequest();
        req.setGender(Gender.MALE);
        req.setWeightKg(160.0);
        req.setHeightCm(205.0);
        req.setAgeYears(22);
        req.setActivityLevel(ActivityLevel.EXTRA_ACTIVE); // 1.9
        req.setGoal("MUSCLE_GAIN");

        RequirementResponse res = calculator.calculate(req);
        // Upper clinical clamp is 4200 kcal
        assertEquals(4200.0, res.getCaloriesTarget());
    }
}
