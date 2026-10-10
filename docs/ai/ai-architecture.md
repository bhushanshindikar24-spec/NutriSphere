# NutriSphere — AI & Intelligence Architecture

## Overview
NutriSphere integrates deterministic clinical algorithms with optional Large Language Model (LLM) advisory pipelines to support clinical decision-making. The system prioritizes deterministic clinical math (Harris-Benedict, Mifflin-St Jeor, macronutrient ratio balancing) as ground truth, using AI strictly for non-binding recommendations, pattern detection, and recipe synthesis.

---

## Intelligence Engine Modules

```
                ┌───────────────────────────────┐
                │   NutriSphere Core Pipeline   │
                └───────────────┬───────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Reality Score │       │Adaptive Engine│       │ Digital Twin  │
│  (Feasibility)│       │(Pattern Recs) │       │ (Projections) │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        │           ┌───────────▼───────────┐           │
        └──────────►│ Clinical Safety Gate  │◄──────────┘
                    │  (Dietitian Approval) │
                    └───────────┬───────────┘
                                ▼
                    ┌───────────────────────┐
                    │ Approved Patient Care │
                    └───────────────────────┘
```

### 1. Reality Score Engine (`com.nutrisphere.intelligence.reality`)
- **Type**: Deterministic Multidimensional Scoring Model.
- **Inputs**: Patient pantry availability, socioeconomic tier, culinary time budget, food allergies, schedule tightness, and past 14-day compliance logs.
- **Output**: 0–100 Feasibility Score across 6 dimensions with clinical radar vectoring.

### 2. Adaptive Diet Engine (`com.nutrisphere.intelligence.adaptive`)
- **Type**: Rule-based Pattern Detection + Optional LLM Synthesis.
- **Inputs**: Rolling 7-day caloric delta, protein deficits, daily water logs, and reported barrier types.
- **Safety Principle**: Recommendations are generated with status `PENDING_REVIEW` and cannot modify active prescriptions without human Dietitian sign-off.

### 3. Nutrition Digital Twin (`com.nutrisphere.intelligence.digitaltwin`)
- **Type**: Dynamic Biomarker & Body Composition Simulation.
- **Inputs**: Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), actual caloric intake, and logged activities.
- **Output**: 30-day weight trajectory curve, macronutrient compliance index, and metabolic stability warning flags.

### 4. Home Food Mode Engine (`com.nutrisphere.intelligence.homefood`)
- **Type**: Constraint Satisfaction Inventory Matcher.
- **Inputs**: Current pantry items with weight in grams.
- **Output**: Ranked meal suggestions maximizing prescription compliance using only on-hand ingredients.
