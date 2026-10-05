# NutriSphere — Adherence Barrier Detection & Root Cause Analysis

## Behavioral Barrier Taxonomy
Patients do not fail diets in a vacuum. NutriSphere categorizes adherence barriers into structured clinical taxonomies:

1. **`TIME_CONSTRAINT`**: Work demands, commute, meal preparation time exceeds budget.
2. **`COST`**: Prescribed foods or fresh produce exceed financial budget.
3. **`FOOD_UNAVAILABLE`**: Prescribed items out of stock or unavailable locally.
4. **`SOCIAL_EVENT`**: Dining out, family gatherings, cultural celebrations.
5. **`CRAVINGS_HUNGER`**: Inadequate satiety, caloric deficit too aggressive.
6. **`COOKING_SKILL`**: Complexity of recipe exceeds culinary confidence.
7. **`DIGESTIVE_DISCOMFORT`**: Bloating, intolerance, reflux, or GI issues.

---

## Analytics Pipeline
- Frequency histogram: Aggregates counts per barrier type for a patient.
- Percentage contribution: Identifies what percentage of deviations are driven by each barrier.
- Dominant barrier extraction: Extracts the highest-frequency barrier for prioritised clinical consultation.
