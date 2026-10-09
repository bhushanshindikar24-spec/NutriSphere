package com.nutrisphere.intelligence.homefood;
import lombok.Data;
import java.util.List;
@Data
public class HomeFoodSuggestion {
    private String mealName;
    private String mealType;
    private List<String> ingredients;
    private double estimatedCalories;
    private double estimatedProteinG;
    private String preparationNotes;
    private boolean matchesDietPlan;
    private String nutritionNote;
    private double complianceScore = 85.0;
    private String complianceGrade = "HIGH_COMPATIBILITY";
    private boolean clinicalSafetyValidated = true;
}
