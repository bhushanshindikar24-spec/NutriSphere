# NutriSphere — Reality Score Engine

## Multidimensional Feasibility Formulation
The Reality Score measures how realistic a diet plan is for a given human being in the real world:

$$\text{Reality Score} = \sum_{k=1}^{6} w_k \cdot S_k$$

Where:
- $w_k$: Dimension weight (normalized to $\sum w_k = 1.0$).
- $S_k$: Sub-score for dimension $k$ (0–100 scale).

---

## The 6 Behavioral Dimensions

| Dimension | Description | Weight ($w_k$) |
|---|---|---|
| **1. Food Availability** | Proximity to grocery markets and ingredient availability | 0.20 |
| **2. Affordability** | Cost of prescribed foods relative to economic tier | 0.20 |
| **3. Cooking Complexity**| Time required for recipe prep vs. patient's free time | 0.15 |
| **4. Personal Preference**| Alignment with patient taste preferences and cultural customs | 0.15 |
| **5. Schedule Alignment**| Meal timing alignment with shift work or meetings | 0.15 |
| **6. Historical Adherence**| 14-day past compliance track record | 0.15 |

---

## Score Interpretations
- **80 – 100**: *High Feasibility* (Patient is very likely to adhere without friction).
- **60 – 79**: *Moderate Feasibility* (Minor friction points detected; small adjustments advised).
- **Below 60**: *High Friction Risk* (Plan is unrealistic; clinician must re-evaluate complexity).
