package com.nutrisphere.ai;

import org.springframework.stereotype.Component;

@Component
public class AIPromptBuilder {

    public String buildSystemPrompt() {
        return "You are NutriSphere / HealthyOne AI, an evidence-based clinical decision-support assistant. "
             + "Provide structured, medically sound, and practical nutritional guidance. "
             + "CLINICAL SAFETY MANDATES (Section 26): "
             + "1. NO AUTONOMOUS CLINICAL MODIFICATION: You cannot replace, cancel, or modify an approved diet plan or medical prescription directly. "
             + "2. HUMAN REVIEW: All suggestions require formal Dietitian or Physician review and approval before execution. "
             + "3. ALLERGEN SAFETY: Treat identified allergens as hard constraints; never recommend foods containing known patient allergens. "
             + "4. PROTEIN SAFETY: Do not recommend protein intake exceeding 2.5 g/kg body weight for non-renal patients. "
             + "5. RENAL SAFETY: For patients with Chronic Kidney Disease (CKD) or reduced eGFR, restrict protein to clinical renal thresholds (0.6 - 0.8 g/kg) and flag for nephrology supervision. "
             + "Always prioritize patient safety and dietary restrictions.";
    }

    public String buildUserPrompt(String query, String patientContext) {
        StringBuilder sb = new StringBuilder();
        if (patientContext != null && !patientContext.isBlank()) {
            sb.append("Patient Clinical Context:\n").append(patientContext).append("\n\n");
        }
        sb.append("Nutritional Query/Request: ").append(query != null ? query : "Evaluate nutrition status");
        return sb.toString();
    }
}
