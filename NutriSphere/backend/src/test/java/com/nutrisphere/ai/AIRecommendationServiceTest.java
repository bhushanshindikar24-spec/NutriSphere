package com.nutrisphere.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrisphere.ai.dto.AIRecommendationRequest;
import com.nutrisphere.integrations.ai.AIProviderClient;
import com.nutrisphere.integrations.ai.AIProviderException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AIRecommendationServiceTest {

    @Test
    void rejectsInvalidStructuredProviderResponse() {
        AIProviderClient client = mock(AIProviderClient.class);
        AIPromptBuilder promptBuilder = new AIPromptBuilder();
        AIContextBuilder contextBuilder = mock(AIContextBuilder.class);

        when(contextBuilder.buildContextForPatient(10L)).thenReturn("approved-plan-context");
        when(client.generateCompletion(anyString(), anyString())).thenReturn("{\"summary\":\"missing required arrays\"}");

        AIRecommendationService service = new AIRecommendationService(
            client, promptBuilder, contextBuilder, new ObjectMapper());

        AIRecommendationRequest request = new AIRecommendationRequest();
        request.setPatientUserId(10L);

        AIProviderException ex = assertThrows(
            AIProviderException.class,
            () -> service.getRecommendations(request));

        assertEquals("AI response missing or invalid field: clinicalRationale", ex.getMessage());
    }

    @Test
    void acceptsOnlyCompleteStructuredProviderResponse() {
        AIProviderClient client = mock(AIProviderClient.class);
        AIPromptBuilder promptBuilder = new AIPromptBuilder();
        AIContextBuilder contextBuilder = mock(AIContextBuilder.class);

        when(contextBuilder.buildContextForPatient(10L)).thenReturn("approved-plan-context");
        when(client.generateCompletion(anyString(), anyString())).thenReturn(
            "{\"summary\":\"summary\",\"recommendations\":[\"rec\"],\"foodsToEncourage\":[\"food\"],\"foodsToAvoid\":[\"avoid\"],\"clinicalRationale\":\"rationale\"}");

        AIRecommendationService service = new AIRecommendationService(
            client, promptBuilder, contextBuilder, new ObjectMapper());

        AIRecommendationRequest request = new AIRecommendationRequest();
        request.setPatientUserId(10L);

        var response = service.getRecommendations(request);

        assertEquals("summary", response.getSummary());
        assertEquals(1, response.getRecommendations().size());
        assertEquals("VALIDATED_DECISION_SUPPORT", response.getGuardrailStatus());
        assertEquals(true, response.isRequiresDietitianApproval());
    }
}
