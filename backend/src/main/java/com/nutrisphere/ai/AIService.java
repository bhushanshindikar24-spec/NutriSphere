package com.nutrisphere.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrisphere.ai.dto.AISummaryResponse;
import com.nutrisphere.integrations.ai.AIProviderClient;
import com.nutrisphere.integrations.ai.AIProviderException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AIService {

    private final AIProviderClient aiClient;
    private final AIPromptBuilder promptBuilder;
    private final AIContextBuilder contextBuilder;
    private final AIResponseValidator validator;
    private final ObjectMapper objectMapper;

    public AIResponse query(AIRequest request) {
        String context = contextBuilder.buildContextForPatient(request.getPatientUserId());
        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(request.getPrompt(), context);

        String rawOutput = aiClient.generateCompletion(systemPrompt, userPrompt);
        return validator.validateAndSanitize(rawOutput);
    }

    public AISummaryResponse getPatientSummary(Long patientUserId) {
        String context = contextBuilder.buildContextForPatient(patientUserId);
        String systemPrompt = promptBuilder.buildSystemPrompt()
            + " Return ONLY valid JSON with exactly these string fields: "
            + "patientSummary, keyObservations, suggestedActions. "
            + "Do not invent measurements or diagnoses. Use only the supplied patient context.";

        String userPrompt = "Create a clinical nutrition summary from this patient context:\n" + context;
        String rawOutput = aiClient.generateCompletion(systemPrompt, userPrompt);
        String validatedContent = validator.validateAndSanitize(rawOutput).getContent();

        try {
            JsonNode root = objectMapper.readTree(validatedContent);
            if (!root.isObject()
                    || !root.hasNonNull("patientSummary")
                    || !root.hasNonNull("keyObservations")
                    || !root.hasNonNull("suggestedActions")) {
                throw new AIProviderException("AI summary did not contain the required structured fields");
            }

            return AISummaryResponse.builder()
                .patientSummary(root.get("patientSummary").asText())
                .keyObservations(root.get("keyObservations").asText())
                .suggestedActions(root.get("suggestedActions").asText())
                .generatedAt(LocalDateTime.now())
                .build();
        } catch (AIProviderException e) {
            throw e;
        } catch (Exception e) {
            throw new AIProviderException("AI summary response was not valid JSON", e);
        }
    }
}
