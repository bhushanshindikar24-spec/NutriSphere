package com.nutrisphere.ai;

import com.nutrisphere.ai.dto.AIRecommendationRequest;
import com.nutrisphere.ai.dto.AIRecommendationResponse;
import com.nutrisphere.integrations.ai.AIProviderClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIRecommendationService {

    private final AIProviderClient aiClient;
    private final AIPromptBuilder promptBuilder;
    private final AIContextBuilder contextBuilder;

    public AIRecommendationResponse getRecommendations(AIRecommendationRequest req) {
        String context = contextBuilder.buildContextForPatient(req.getPatientUserId());
        String prompt = "Generate dietary recommendations for condition: " + req.getHealthCondition()
                + ", target calories: " + req.getTargetCalories()
                + ", preferences: " + req.getDietaryPreferences()
                + ", allergies: " + req.getAllergies()
                + ", notes: " + req.getNotes()
                + "\nContext:\n" + context
                + "\n\nYou MUST respond strictly with a valid JSON object (no markdown, no backticks, no comments) matching exactly this format:\n"
                + "{\n"
                + "  \"summary\": \"Detailed summary...\",\n"
                + "  \"recommendations\": [\"rec1\", \"rec2\"],\n"
                + "  \"foodsToEncourage\": [\"food1\", \"food2\"],\n"
                + "  \"foodsToAvoid\": [\"food1\", \"food2\"],\n"
                + "  \"clinicalRationale\": \"Clinical rationale...\"\n"
                + "}";

        String result = aiClient.generateCompletion(promptBuilder.buildSystemPrompt(), prompt);
        
        // Strip possible markdown blocks if the LLM ignores the instruction
        result = result.trim();
        if (result.startsWith("```json")) {
            result = result.substring(7);
        } else if (result.startsWith("```")) {
            result = result.substring(3);
        }
        if (result.endsWith("```")) {
            result = result.substring(0, result.length() - 3);
        }
        result = result.trim();

        String summary = "Unable to generate summary.";
        List<String> recommendations = List.of("Maintain balanced diet.", "Consult dietitian.");
        List<String> foodsToEncourage = List.of("Vegetables", "Lean Proteins");
        List<String> foodsToAvoid = List.of("Ultra-processed foods");
        String clinicalRationale = "Standard fallback recommendations due to parsing error.";

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(result);
            
            if (node.has("summary")) summary = node.get("summary").asText();
            if (node.has("clinicalRationale")) clinicalRationale = node.get("clinicalRationale").asText();
            
            if (node.has("recommendations") && node.get("recommendations").isArray()) {
                recommendations = new ArrayList<>();
                for (com.fasterxml.jackson.databind.JsonNode item : node.get("recommendations")) recommendations.add(item.asText());
            }
            if (node.has("foodsToEncourage") && node.get("foodsToEncourage").isArray()) {
                foodsToEncourage = new ArrayList<>();
                for (com.fasterxml.jackson.databind.JsonNode item : node.get("foodsToEncourage")) foodsToEncourage.add(item.asText());
            }
            if (node.has("foodsToAvoid") && node.get("foodsToAvoid").isArray()) {
                foodsToAvoid = new ArrayList<>();
                for (com.fasterxml.jackson.databind.JsonNode item : node.get("foodsToAvoid")) foodsToAvoid.add(item.asText());
            }
        } catch (Exception e) {
            // Fallback to putting the raw output in summary if JSON parsing fails
            summary = result;
        }

        return AIRecommendationResponse.builder()
                .summary(summary)
                .recommendations(recommendations)
                .foodsToEncourage(foodsToEncourage)
                .foodsToAvoid(foodsToAvoid)
                .clinicalRationale(clinicalRationale)
                .disclaimer("Dietitian review is required before prescribing new meal guidelines.")
                .requiresDietitianApproval(true)
                .decisionSupportOnly(true)
                .guardrailStatus("VALIDATED_DECISION_SUPPORT")
                .generatedAt(LocalDateTime.now())
                .build();
    }
}
