# NutriSphere — Home Food Mode Engine

## Problem Statement
A major cause of dietary non-adherence is the "empty fridge syndrome": the patient's diet plan specifies salmon and asparagus, but their kitchen only has eggs, spinach, and brown rice. Rather than starving or ordering takeout, Home Food Mode allows the patient to cook with what is already available.

---

## Technical Mechanism
1. **Pantry Inventory (`home_food_inventory`)**:
   - Patient logs on-hand items with estimated quantity in grams and category (`GRAINS`, `PROTEIN`, `DAIRY`, `VEGETABLES`, `FRUITS`, `PANTRY_STAPLE`).
2. **Constraint-Satisfaction Matcher**:
   - The engine searches recipe templates matching available pantry categories.
   - Calculates total calories and macronutrients of synthesized dishes.
   - Computes a Compliance Score relative to the patient's prescribed meal target.
3. **Execution**:
   - Patient accepts the suggestion and logs it directly to `food_logs` with a single tap.
