# NutriSphere — Nutrition Digital Twin Specification

## Conceptual Model
The Nutrition Digital Twin is a digital proxy of the patient's nutritional and metabolic state. It models the cumulative biological effect of daily dietary intake against energy expenditure.

---

## Projected Trajectory Formula
Weight projection over an $N$-day horizon is calculated using the dynamic energy balance model:

$$\Delta W = \frac{\sum_{i=1}^{N} (\text{Caloric Intake}_i - \text{TDEE}_i)}{7700\text{ kcal/kg}}$$

Where:
- $\text{TDEE} = \text{BMR} \times \text{Physical Activity Factor}$
- $7700\text{ kcal}$ represents the energetic equivalent of $1\text{ kg}$ of human adipose/lean mass tissue.

---

## Output Metrics
1. **7-Day Rolling Nutrient Distribution**: Daily average kcal, protein (g), carbohydrates (g), fat (g), and water (ml).
2. **Projected Weight Curve**: 30-day simulated body weight trajectory assuming continuation of current 7-day intake averages.
3. **Metabolic Health Status**: Classified as `OPTIMAL`, `STABLE`, `DEFICIT_WARNING`, or `SURPLUS_WARNING`.
