package com.nutrisphere.nutrition.requirements.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequirementResponse {
    private Long id;
    private Long patientUserId;
    private Double caloriesTarget;
    private Double bmr;
    private Double tdee;
    private Double proteinGTarget;
    private Double carbsGTarget;
    private Double fatGTarget;
    private Double fiberGTarget;
    private Double waterMlTarget;
    private String calculationMethod;
    private String notes;
    private boolean active;

    // Detailed Macronutrients
    private Double saturatedFatGTarget;
    private Double monounsaturatedFatGTarget;
    private Double polyunsaturatedFatGTarget;
    private Double addedSugarGTarget;

    // Vitamins
    private Double vitaminA;    // mcg RAE
    private Double vitaminB1;   // mg (Thiamine)
    private Double vitaminB2;   // mg (Riboflavin)
    private Double vitaminB3;   // mg (Niacin)
    private Double vitaminB5;   // mg (Pantothenic Acid)
    private Double vitaminB6;   // mg (Pyridoxine)
    private Double vitaminB7;   // mcg (Biotin)
    private Double vitaminB9;   // mcg (Folate)
    private Double vitaminB12;  // mcg (Cobalamin)
    private Double vitaminC;    // mg (Ascorbic Acid)
    private Double vitaminD;    // mcg (Cholecalciferol)
    private Double vitaminE;    // mg (Alpha-tocopherol)
    private Double vitaminK;    // mcg (Phylloquinone)

    // Minerals
    private Double calcium;     // mg
    private Double iron;        // mg
    private Double magnesium;   // mg
    private Double zinc;        // mg
    private Double potassium;   // mg
    private Double sodium;      // mg
    private Double phosphorus;  // mg
    private Double selenium;    // mcg
    private Double iodine;      // mcg
    private Double copper;      // mg

    // Other Parameters
    private Double omega3GTarget; // g

    // Clinical Context, Explanations & Data Gap Audit
    private String clinicalRationale;
    private List<String> identifiedDeficiencies;
    private List<String> dataGaps;
    private List<String> abnormalFlags;
    private boolean requiresDietitianApproval;
}
