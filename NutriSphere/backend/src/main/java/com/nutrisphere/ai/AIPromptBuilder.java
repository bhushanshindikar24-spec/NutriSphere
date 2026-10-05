package com.nutrisphere.ai;

import org.springframework.stereotype.Component;

@Component
public class AIPromptBuilder {

    public String buildSystemPrompt() {
        return "You are NutriSphere AI, an evidence-based clinical decision-support assistant. "
             + "Provide structured, medically sound, and practical nutritional guidance. "
             + "STRICT GUARDRAILS: You are a Decision-Support Assistant ONLY. You MUST NOT diagnose medical conditions, prescribe medication changes, or autonomously alter approved diet plans or clinical prescriptions. "
             + "Always prioritize patient safety, dietary restrictions, and clinical guidelines. All suggestions require formal Dietitian/Physician review before application.";
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
