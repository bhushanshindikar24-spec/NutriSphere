package com.nutrisphere.intelligence.homefood;

import com.nutrisphere.intelligence.homefood.dto.MealSuggestionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealSuggestionService {
    private final HomeFoodService homeFoodService;

    public List<MealSuggestionResponse> getSuggestionsForPatient(Long patientUserId) {
        List<HomeFoodSuggestion> list = homeFoodService.generateSuggestions(patientUserId);
        return list.stream().map(s -> MealSuggestionResponse.builder()
                .mealName(s.getMealName())
                .mealType(s.getMealType())
                .ingredients(s.getIngredients())
                .estimatedCalories(s.getEstimatedCalories())
                .estimatedProteinG(s.getEstimatedProteinG())
                .preparationNotes(s.getPreparationNotes())
                .matchesDietPlan(s.isMatchesDietPlan())
                .nutritionNote(s.getNutritionNote())
                .clinicalSafetyValidated(s.isClinicalSafetyValidated())
                .build()
        ).collect(Collectors.toList());
    }
}
