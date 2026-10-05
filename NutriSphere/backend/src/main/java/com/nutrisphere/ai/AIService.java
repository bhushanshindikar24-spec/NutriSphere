package com.nutrisphere.ai;

import com.nutrisphere.ai.dto.AISummaryResponse;
import com.nutrisphere.integrations.ai.AIProviderClient;
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

    public AIResponse query(AIRequest request) {
        String context = contextBuilder.buildContextForPatient(request.getPatientUserId());
        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(request.getPrompt(), context);

        String rawOutput = aiClient.generateCompletion(systemPrompt, userPrompt);
        return validator.validateAndSanitize(rawOutput);
    }

    public AISummaryResponse getPatientSummary(Long patientUserId) {
        String context = contextBuilder.buildContextForPatient(patientUserId);
        String systemPrompt = "You are a clinical nutrition specialist summarizing patient status for dietitians and clinicians.";
        String userPrompt = "Summarize the nutritional profile, risks, and recommended actions based on:\n" + context;

        String rawOutput = aiClient.generateCompletion(systemPrompt, userPrompt);

        return AISummaryResponse.builder()
                .patientSummary(rawOutput)
                .keyObservations("Review adherence barriers and maintain target caloric density.")
                .suggestedActions("Monitor weekly weight trend and ensure diet plan adherence.")
                .generatedAt(LocalDateTime.now())
                .build();
    }
}
