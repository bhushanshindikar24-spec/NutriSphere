# NutriSphere — AI Use Cases

## 1. Reality Score Optimization
- **Problem**: Patients abandon diet plans within 14 days due to unaddressed lifestyle friction (expensive ingredients, complicated prep, tight schedules).
- **AI Solution**: The Reality Score engine identifies low-scoring dimensions (e.g. Cooking Complexity < 40) and proposes pragmatic meal alternatives (e.g. 15-minute one-pan meals or kitchen delivery options).

## 2. Low Intake & Hydration Detection
- **Problem**: Sub-clinical dehydration and persistent protein deficit go unnoticed until lab reports or metabolic plateaus occur.
- **AI Solution**: Rolling 7-day window detection flags intake dips (>30% below target) and creates clinical reminders for both the patient and the supervising Dietitian.

## 3. Recurring Barrier Resolution
- **Problem**: Patients repeatedly log the same barrier (e.g., `TIME_CONSTRAINT` on weekdays).
- **AI Solution**: When a barrier appears $\ge 3$ times in 7 days, the system triggers a `BARRIER_PATTERN` recommendation prompting the clinician to adjust meal prep frequency or recommend hotel kitchen meal kits.

## 4. Home Food Inventory Recipe Synthesis
- **Problem**: Patients eat off-plan because they do not have the prescribed groceries at home.
- **AI Solution**: Patients log available pantry items. The inventory matcher synthesizes compliant recipe combinations that stay within daily caloric and macro targets.

## 5. Nutrition Digital Twin Projection
- **Problem**: Patients lose motivation because biological changes lag behavioral changes.
- **AI Solution**: Projections simulate 30-day weight and metabolic outcomes based on current daily actuals vs. prescribed targets, reinforcing adherence through visual trajectory curves.
