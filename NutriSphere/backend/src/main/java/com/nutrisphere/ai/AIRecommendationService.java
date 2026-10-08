package com.nutrisphere.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrisphere.ai.dto.AIRecommendationRequest;
import com.nutrisphere.ai.dto.AIRecommendationResponse;
import com.nutrisphere.integrations.ai.AIProviderClient;
import com.nutrisphere.integrations.ai.AIProviderException;
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
    private final ObjectMapper objectMapper;

    public AIRecommendationResponse getRecommendations(AIRecommendationRequest req) {
        if (req.getPatientUserId() == null) {
            throw new IllegalArgumentException("patientUserId is required");
        }

        String context = contextBuilder.buildContextForPatient(req.getPatientUserId());
        String prompt = "Generate dietary decision-support recommendations using only the supplied patient context. "
                + "Do not diagnose, prescribe medication changes, or modify an approved diet plan. "
                + "Return ONLY a valid JSON object with exactly these fields: "
                + "summary (string), recommendations (array of strings), foodsToEncourage (array of strings), "
                + "foodsToAvoid (array of strings), clinicalRationale (string). "
                + "Do not use markdown or code fences.\n"
                + "Condition: " + req.getHealthCondition()
                + "\nTarget calories: " + req.getTargetCalories()
                + "\nPreferences: " + req.getDietaryPreferences()
                + "\nAllergies: " + req.getAllergies()
                + "\nNotes: " + req.getNotes()
                + "\nPatient context:\n" + context;

        String result = aiClient.generateCompletion(promptBuilder.buildSystemPrompt(), prompt).trim();

        try {
            JsonNode node = objectMapper.readTree(result);
            requireField(node, "summary", JsonNode::isTextual);
            requireField(node, "clinicalRationale", JsonNode::isTextual);
            requireField(node, "recommendations", JsonNode::isArray);
            requireField(node, "foodsToEncourage", JsonNode::isArray);
            requireField(node, "foodsToAvoid", JsonNode::isArray);

            List<String> recommendations = toStringList(node.get("recommendations"));
            List<String> foodsToEncourage = toStringList(node.get("foodsToEncourage"));
            List<String> foodsToAvoid = toStringList(node.get("foodsToAvoid"));

            return AIRecommendationResponse.builder()
                .summary(node.get("summary").asText())
                .recommendations(recommendations)
                .foodsToEncourage(foodsToEncourage)
                .foodsToAvoid(foodsToAvoid)
                .clinicalRationale(node.get("clinicalRationale").asText())
                .disclaimer("Dietitian or physician review is required before applying recommendations.")
                .requiresDietitianApproval(true)
                .decisionSupportOnly(true)
                .guardrailStatus("VALIDATED_DECISION_SUPPORT")
                .generatedAt(LocalDateTime.now())
                .build();
        } catch (AIProviderException e) {
            throw e;
        } catch (Exception e) {
            throw new AIProviderException("AI recommendation response was not valid structured JSON", e);
        }
    }

    private void requireField(JsonNode node, String name, java.util.function.Predicate<JsonNode> predicate) {
        if (node == null || !node.has(name) || !predicate.test(node.get(name))) {
            throw new AIProviderException("AI response missing or invalid field: " + name);
        }
    }

    private List<String> toStringList(JsonNode array) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            if (!item.isTextual()) {
                throw new AIProviderException("AI response contains a non-string list item");
            }
            values.add(item.asText());
        }
        return values;
    }
}
