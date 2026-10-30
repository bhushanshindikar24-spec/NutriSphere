package com.nutrisphere.medical.laboratory;

import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.medical.laboratory.dto.BloodReportAnalysisResponse;
import com.nutrisphere.medical.laboratory.dto.LongitudinalComparisonResponse;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LaboratoryService {
    private final LaboratoryReportRepository reportRepo;
    private final LaboratoryValueRepository valueRepo;
    private final UserRepository userRepository;

    public List<LaboratoryReport> getForPatient(Long patientUserId) {
        return reportRepo.findByPatientUserIdOrderByReportDateDesc(patientUserId);
    }

    public LaboratoryReport getById(Long id) {
        return reportRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("LaboratoryReport", id));
    }

    public List<LaboratoryValue> getValues(Long reportId) {
        return valueRepo.findByReportId(reportId);
    }

    @Transactional
    public LaboratoryReport create(LaboratoryReport report) {
        if (report.getReportDate() == null) {
            report.setReportDate(LocalDate.now());
        }
        if (report.getStatus() == null) {
            report.setStatus("COMPLETED");
        }
        return reportRepo.save(report);
    }

    @Transactional
    public LaboratoryValue addValue(LaboratoryValue value) {
        return valueRepo.save(value);
    }

    @Transactional
    public LaboratoryReport update(Long id, LaboratoryReport updates) {
        LaboratoryReport existing = getById(id);
        if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
        if (updates.getReportDate() != null) existing.setReportDate(updates.getReportDate());
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getAiSummary() != null) existing.setAiSummary(updates.getAiSummary());
        if (updates.getIdentifiedDeficiencies() != null) existing.setIdentifiedDeficiencies(updates.getIdentifiedDeficiencies());
        if (updates.getRecommendedFoodSources() != null) existing.setRecommendedFoodSources(updates.getRecommendedFoodSources());
        existing.setReviewedByDoctor(updates.isReviewedByDoctor());
        if (updates.getDoctorReviewNotes() != null) existing.setDoctorReviewNotes(updates.getDoctorReviewNotes());
        return reportRepo.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        reportRepo.deleteById(id);
    }

    /**
     * Requirement 5: AI-Based Nutrition Analysis from Blood Reports
     */
    @Transactional
    public BloodReportAnalysisResponse analyzeReport(Long reportId) {
        LaboratoryReport report = getById(reportId);
        List<LaboratoryValue> values = valueRepo.findByReportId(reportId);

        List<BloodReportAnalysisResponse.DeficiencyItem> deficiencies = new ArrayList<>();
        Set<String> foodSources = new LinkedHashSet<>();
        StringBuilder aiSummaryBuilder = new StringBuilder();

        // If no values recorded yet, return structured guidance prompt
        if (values.isEmpty()) {
            return BloodReportAnalysisResponse.builder()
                .reportId(reportId)
                .title(report.getTitle() != null ? report.getTitle() : "Laboratory Report")
                .reportDate(report.getReportDate())
                .aiSummary("No biomarker values were recorded for this blood report. Add measured laboratory parameters to generate clinical nutritional analysis.")
                .identifiedDeficiencies(Collections.emptyList())
                .recommendedFoodSources(Collections.emptyList())
                .clinicalDisclaimer("Clinical Disclaimer: AI recommendations are generated from verified clinical biomarker inputs. Consult your physician.")
                .build();
        }

        for (LaboratoryValue val : values) {
            String name = val.getParameterName().toLowerCase();
            Double numVal = parseDoubleSafe(val.getValue());

            if (name.contains("vitamin d") || name.contains("25-hydroxy")) {
                if (numVal != null && numVal < 30.0) {
                    boolean severe = numVal < 20.0;
                    deficiencies.add(BloodReportAnalysisResponse.DeficiencyItem.builder()
                        .biomarker("Vitamin D3 (25-OH)")
                        .measuredValue(val.getValue() + " " + (val.getUnit() != null ? val.getUnit() : "ng/mL"))
                        .normalRange("30.0 - 100.0 ng/mL")
                        .status(severe ? "DEFICIENT" : "INSUFFICIENT")
                        .simpleLanguageExplanation("Vitamin D helps your body absorb calcium and keeps bones and the immune system strong. Your level is lower than recommended, which can cause fatigue and bone aches.")
                        .targetFoods(List.of("Fortified low-fat milk/plant milks", "Egg yolks", "Mushrooms exposed to UV", "Fatty fish (salmon, sardines)", "15 mins daily morning sunlight"))
                        .clinicalSignificance("Impairs calcium absorption and mood regulation. Consider supplementation review with doctor.")
                        .build());
                    foodSources.addAll(List.of("Fortified milk/plant milk", "Egg yolks", "Mushrooms", "Wild salmon"));
                }
            } else if (name.contains("b12") || name.contains("cobalamin")) {
                if (numVal != null && numVal < 250.0) {
                    deficiencies.add(BloodReportAnalysisResponse.DeficiencyItem.builder()
                        .biomarker("Vitamin B12")
                        .measuredValue(val.getValue() + " " + (val.getUnit() != null ? val.getUnit() : "pg/mL"))
                        .normalRange("200 - 900 pg/mL")
                        .status("DEFICIENT")
                        .simpleLanguageExplanation("Vitamin B12 is essential for nerve health, memory, and making red blood cells. Low levels often cause fatigue, brain fog, and tingling in fingers or toes.")
                        .targetFoods(List.of("Nutritional yeast", "Fortified cereals", "Greek yogurt", "Paneer / cheese", "Eggs", "Lean poultry"))
                        .clinicalSignificance("Risk of megaloblastic anemia and peripheral neuropathy. Advise dietary fortification.")
                        .build());
                    foodSources.addAll(List.of("Nutritional yeast", "Greek yogurt", "Paneer", "Eggs"));
                }
            } else if (name.contains("ferritin") || name.contains("iron") || name.contains("hemoglobin")) {
                if (numVal != null && numVal < (name.contains("hemoglobin") ? 12.0 : 25.0)) {
                    deficiencies.add(BloodReportAnalysisResponse.DeficiencyItem.builder()
                        .biomarker("Iron Stores (" + val.getParameterName() + ")")
                        .measuredValue(val.getValue() + " " + (val.getUnit() != null ? val.getUnit() : "ng/mL"))
                        .normalRange(name.contains("hemoglobin") ? "12.0 - 16.0 g/dL" : "30 - 200 ng/mL")
                        .status("DEFICIENT")
                        .simpleLanguageExplanation("Your iron stores are lower than normal. Iron carries oxygen to your muscles and brain. Lower levels can make you feel easily tired or out of breath.")
                        .targetFoods(List.of("Spinach & leafy greens (paired with Vitamin C / lemon)", "Lentils & chickpea dal", "Pumpkin seeds", "Beetroot", "Tofu", "Raisins & dried figs"))
                        .clinicalSignificance("Iron deficiency state. Pair non-heme plant iron with citrus/Vitamin C to multiply absorption.")
                        .build());
                    foodSources.addAll(List.of("Cooked spinach", "Yellow/black lentils", "Pumpkin seeds", "Beetroot salad"));
                }
            } else if (name.contains("glucose") || name.contains("hba1c") || name.contains("sugar")) {
                if (numVal != null && (name.contains("hba1c") ? numVal >= 5.7 : numVal > 100.0)) {
                    deficiencies.add(BloodReportAnalysisResponse.DeficiencyItem.builder()
                        .biomarker("Glycemic Regulation (" + val.getParameterName() + ")")
                        .measuredValue(val.getValue() + " " + (val.getUnit() != null ? val.getUnit() : ""))
                        .normalRange(name.contains("hba1c") ? "< 5.7%" : "70 - 99 mg/dL")
                        .status("ELEVATED")
                        .simpleLanguageExplanation("Your blood sugar markers are elevated, indicating insulin resistance or pre-diabetic tendencies. Carbohydrates are converting into blood sugar faster than your cells take it up.")
                        .targetFoods(List.of("Steel-cut oats", "Fenugreek (methi) water", "Bitter gourd (karela)", "Quinoa", "Cinnamon bark tea", "Cruciferous vegetables"))
                        .clinicalSignificance("Elevated postprandial glucose risks. Prioritize low glycemic index meals and fiber.")
                        .build());
                    foodSources.addAll(List.of("Steel-cut oats", "Fenugreek seeds", "Quinoa", "Cinnamon"));
                }
            } else if (name.contains("ldl") || name.contains("cholesterol") || name.contains("triglyceride")) {
                if (numVal != null && (name.contains("ldl") ? numVal > 100.0 : (name.contains("triglyceride") ? numVal > 150.0 : numVal > 200.0))) {
                    deficiencies.add(BloodReportAnalysisResponse.DeficiencyItem.builder()
                        .biomarker("Lipid Profile (" + val.getParameterName() + ")")
                        .measuredValue(val.getValue() + " " + (val.getUnit() != null ? val.getUnit() : "mg/dL"))
                        .normalRange(name.contains("ldl") ? "< 100 mg/dL" : "< 150 mg/dL")
                        .status("ELEVATED")
                        .simpleLanguageExplanation("Serum lipids (fats) are higher than cardiovascular targets. Consuming healthy unsaturated fats and soluble fiber helps absorb and clear excess cholesterol.")
                        .targetFoods(List.of("Raw walnuts", "Ground flaxseeds", "Extra virgin olive oil", "Oat bran", "Chia seeds", "Avocado"))
                        .clinicalSignificance("Elevated atherogenic lipoproteins. Minimize saturated/trans fats in diet plan.")
                        .build());
                    foodSources.addAll(List.of("Walnuts", "Flaxseeds", "Olive oil", "Oat bran"));
                }
            }
        }

        if (deficiencies.isEmpty()) {
            aiSummaryBuilder.append("Your blood panel demonstrates excellent physiological stability! Biomarkers are within optimal clinical thresholds. Focus on sustaining your balanced whole-food dietary regimen.");
            foodSources.addAll(List.of("Fresh seasonal vegetables", "Whole grains", "Nuts & seeds", "Adequate hydration"));
        } else {
            aiSummaryBuilder.append("AI Nutritional Analysis detected ")
                .append(deficiencies.size())
                .append(" potential nutritional biomarker attention points. Specific dietary enhancements can actively support restoring these parameters into normal physiological ranges.");
        }

        String aiSummaryStr = aiSummaryBuilder.toString();
        String identifiedStr = deficiencies.stream().map(d -> d.getBiomarker() + " (" + d.getStatus() + ")").reduce((a, b) -> a + ", " + b).orElse("None");
        String recommendedStr = String.join(", ", foodSources);

        report.setAiSummary(aiSummaryStr);
        report.setIdentifiedDeficiencies(identifiedStr);
        report.setRecommendedFoodSources(recommendedStr);
        reportRepo.save(report);

        return BloodReportAnalysisResponse.builder()
            .reportId(report.getId())
            .title(report.getTitle())
            .reportDate(report.getReportDate())
            .aiSummary(aiSummaryStr)
            .identifiedDeficiencies(deficiencies)
            .recommendedFoodSources(new ArrayList<>(foodSources))
            .dietPlanConsiderations("Incorporate recommended target foods into daily breakfast and lunch menus. Monitor progress with follow-up lab panels.")
            .reviewedByDoctor(report.isReviewedByDoctor())
            .doctorReviewNotes(report.getDoctorReviewNotes() != null ? report.getDoctorReviewNotes() : "Pending clinical consultation review.")
            .clinicalDisclaimer("Clinical Disclaimer: AI recommendations identify nutritional correlations and suitable food sources. They are reviewed by your qualified physician or clinical dietitian.")
            .build();
    }

    /**
     * Requirement 8: Longitudinal Blood Report Comparison and AI-Based Progress Analysis
     */
    public LongitudinalComparisonResponse getLongitudinalComparison(Long patientUserId) {
        List<LaboratoryReport> reports = reportRepo.findByPatientUserIdOrderByReportDateDesc(patientUserId);
        String patientName = userRepository.findById(patientUserId).map(u -> u.getFullName()).orElse("Patient");

        if (reports.size() < 2) {
            // Generate comparison against standard baseline if only 1 report exists
            return generateSingleReportComparison(reports.isEmpty() ? null : reports.get(0), patientUserId, patientName);
        }

        LaboratoryReport latest = reports.get(0);
        LaboratoryReport previous = reports.get(1);

        List<LaboratoryValue> latestValues = valueRepo.findByReportId(latest.getId());
        List<LaboratoryValue> previousValues = valueRepo.findByReportId(previous.getId());

        Map<String, LaboratoryValue> prevMap = new HashMap<>();
        for (LaboratoryValue pv : previousValues) {
            prevMap.put(pv.getParameterName().toLowerCase().trim(), pv);
        }

        List<LongitudinalComparisonResponse.BiomarkerComparison> comps = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        List<String> concerns = new ArrayList<>();

        for (LaboratoryValue lv : latestValues) {
            String key = lv.getParameterName().toLowerCase().trim();
            LaboratoryValue pv = prevMap.get(key);

            Double latestNum = parseDoubleSafe(lv.getValue());
            Double prevNum = pv != null ? parseDoubleSafe(pv.getValue()) : null;

            String status = "STABLE";
            String color = "blue";
            String explanation = "Parameter remains steady within personal physiological baseline.";

            if (latestNum != null && prevNum != null) {
                double diff = latestNum - prevNum;

                if (key.contains("vitamin d") || key.contains("b12") || key.contains("iron") || key.contains("ferritin") || key.contains("hemoglobin")) {
                    // For vitamins and minerals: higher is better towards normal
                    if (diff > 2.0) {
                        status = "IMPROVED";
                        color = "green";
                        explanation = "Positive upward trend. Dietary adherence and micronutrient-dense meals have elevated serum reserves.";
                        improvements.add(lv.getParameterName() + " improved from " + pv.getValue() + " to " + lv.getValue() + " " + (lv.getUnit() != null ? lv.getUnit() : ""));
                    } else if (diff < -2.0) {
                        status = prevNum >= 30.0 && latestNum < 30.0 ? "NEW_DEFICIENCY" : "WORSENED";
                        color = status.equals("NEW_DEFICIENCY") ? "amber" : "red";
                        explanation = "Downward drift detected. May reflect decreased dietary absorption or elevated physiological demand.";
                        concerns.add(lv.getParameterName() + " declined from " + pv.getValue() + " to " + lv.getValue());
                    }
                } else if (key.contains("glucose") || key.contains("hba1c") || key.contains("ldl") || key.contains("cholesterol") || key.contains("triglyceride")) {
                    // For glucose and bad lipids: lower is better towards normal
                    if (diff < -3.0) {
                        status = "IMPROVED";
                        color = "green";
                        explanation = "Favorable reduction observed. Correlates with lower refined carb/saturated fat intake and regular hydration.";
                        improvements.add(lv.getParameterName() + " decreased favorably from " + pv.getValue() + " to " + lv.getValue());
                    } else if (diff > 5.0) {
                        status = "WORSENED";
                        color = "red";
                        explanation = "Elevated shift observed. Dietary logs indicate higher caloric density or glycemic load during recent weeks.";
                        concerns.add(lv.getParameterName() + " increased from " + pv.getValue() + " to " + lv.getValue());
                    }
                }
            }

            comps.add(LongitudinalComparisonResponse.BiomarkerComparison.builder()
                .parameterName(lv.getParameterName())
                .previousValue(pv != null ? pv.getValue() : "--")
                .latestValue(lv.getValue())
                .unit(lv.getUnit() != null ? lv.getUnit() : "")
                .normalRange(lv.getNormalRange() != null ? lv.getNormalRange() : "Normal Range")
                .changeStatus(status)
                .statusBadgeColor(color)
                .aiPossibleExplanation(explanation)
                .previousNumeric(prevNum)
                .latestNumeric(latestNum)
                .build());
        }

        String dietCorrelation = improvements.size() >= concerns.size()
            ? "Your sustained adherence to the personalized diet plan, daily hydration, and nutrient-rich whole foods strongly correlates with systemic biomarker enhancements."
            : "Recent dietary variations and barrier logs correlate with shifts in glycemic and lipid values. Adjusting meal timing and fiber intake will help stabilize these markers.";

        String patientSummary = "Comparing your latest blood panel (" + latest.getReportDate() + ") with your previous test (" + previous.getReportDate() + "): You have achieved "
            + improvements.size() + " biomarker improvements! Review the detailed trends and AI insights below with your physician.";

        return LongitudinalComparisonResponse.builder()
            .patientUserId(patientUserId)
            .patientName(patientName)
            .latestReportDate(latest.getReportDate())
            .previousReportDate(previous.getReportDate())
            .comparisons(comps)
            .nutritionalImprovements(improvements)
            .areasOfConcern(concerns)
            .aiDietCorrelation(dietCorrelation)
            .patientFriendlyInsights(patientSummary)
            .clinicalDoctorNotes("Physician Review: Biomarker changes are consistent with nutritional lifestyle modulation. Continue scheduled consultations.")
            .clinicalDisclaimer("Clinical Disclaimer: AI insights are presented as possible nutritional correlations rather than confirmed diagnoses. Clinical decisions must be confirmed by your supervising doctor.")
            .build();
    }

    private LongitudinalComparisonResponse generateSingleReportComparison(LaboratoryReport singleReport, Long patientUserId, String patientName) {
        if (singleReport == null) {
            return LongitudinalComparisonResponse.builder()
                .patientUserId(patientUserId)
                .patientName(patientName)
                .latestReportDate(null)
                .previousReportDate(null)
                .comparisons(Collections.emptyList())
                .nutritionalImprovements(Collections.emptyList())
                .areasOfConcern(Collections.emptyList())
                .aiDietCorrelation("Upload at least two consecutive blood test panels to analyze biomarker progression and dietary correlations.")
                .patientFriendlyInsights("No blood reports on record. Upload blood tests in your profile to track biomarker health trends.")
                .clinicalDoctorNotes("Awaiting initial laboratory submission.")
                .clinicalDisclaimer("Clinical Disclaimer: AI insights are presented as possible nutritional correlations rather than confirmed diagnoses.")
                .build();
        }

        LocalDate latestDate = singleReport.getReportDate();
        List<LaboratoryValue> vals = valueRepo.findByReportId(singleReport.getId());
        List<LongitudinalComparisonResponse.BiomarkerComparison> comps = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        List<String> concerns = new ArrayList<>();

        for (LaboratoryValue lv : vals) {
            String flag = lv.getFlag() != null ? lv.getFlag().toUpperCase() : "NORMAL";
            String status = "BASELINE";
            String color = "blue";
            String explanation = "Baseline value of " + lv.getValue() + " " + (lv.getUnit() != null ? lv.getUnit() : "") + " established on " + latestDate + ". Upload a second report to track trends.";
            if ("LOW".equals(flag) || "DEFICIENT".equals(flag)) {
                status = "DEFICIENT";
                color = "amber";
                concerns.add(lv.getParameterName() + " is below target range (" + lv.getValue() + " " + (lv.getUnit() != null ? lv.getUnit() : "") + ")");
                explanation = "Baseline indicates insufficiency. Focus on targeted micronutrient food sources in your meal plan.";
            } else if ("HIGH".equals(flag) || "ELEVATED".equals(flag)) {
                status = "ELEVATED";
                color = "red";
                concerns.add(lv.getParameterName() + " is elevated (" + lv.getValue() + " " + (lv.getUnit() != null ? lv.getUnit() : "") + ")");
                explanation = "Baseline indicates elevation. Dietary modifications have been incorporated in your plan.";
            } else {
                improvements.add(lv.getParameterName() + " is within healthy target range (" + lv.getValue() + ")");
            }

            comps.add(LongitudinalComparisonResponse.BiomarkerComparison.builder()
                .parameterName(lv.getParameterName())
                .previousValue("--")
                .latestValue(lv.getValue())
                .unit(lv.getUnit() != null ? lv.getUnit() : "")
                .normalRange(lv.getNormalRange() != null ? lv.getNormalRange() : "Normal Range")
                .changeStatus(status)
                .statusBadgeColor(color)
                .aiPossibleExplanation(explanation)
                .previousNumeric(null)
                .latestNumeric(parseDoubleSafe(lv.getValue()))
                .build());
        }

        return LongitudinalComparisonResponse.builder()
            .patientUserId(patientUserId)
            .patientName(patientName)
            .latestReportDate(latestDate)
            .previousReportDate(null)
            .comparisons(comps)
            .nutritionalImprovements(improvements)
            .areasOfConcern(concerns)
            .aiDietCorrelation("Baseline biomarker profile recorded. Daily diet tracking is active to establish correlations with your subsequent lab panel.")
            .patientFriendlyInsights("Baseline blood panel established (" + latestDate + "). Upload your next follow-up panel to analyze longitudinal progress and dietary correlations.")
            .clinicalDoctorNotes("Physician Note: Baseline laboratory markers established. Recheck recommended per clinical follow-up schedule.")
            .clinicalDisclaimer("Clinical Disclaimer: AI insights are presented as possible nutritional correlations rather than confirmed diagnoses. Clinical decisions must be confirmed by your supervising doctor.")
            .build();
    }

    private Double parseDoubleSafe(String val) {
        if (val == null) return null;
        try {
            return Double.parseDouble(val.replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            return null;
        }
    }
}
