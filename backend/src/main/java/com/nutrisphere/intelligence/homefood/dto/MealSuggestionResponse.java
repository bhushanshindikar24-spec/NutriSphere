package com.nutrisphere.intelligence.homefood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealSuggestionResponse {
    private String mealName;
    private String mealType;
    private List<String> ingredients;
    private Double estimatedCalories;
    private Double estimatedProteinG;
    private String preparationNotes;
    private boolean matchesDietPlan;
    private String nutritionNote;
    private boolean clinicalSafetyValidated;
}
