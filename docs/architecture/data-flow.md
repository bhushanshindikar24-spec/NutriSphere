# NutriSphere — Data Flow Architecture

## Care Continuum Flow

```
Doctor                  Dietitian                 Patient                 Hotel Kitchen
  │                         │                        │                          │
  ├─ Clinical Diagnosis ────►                        │                          │
  │  (Conditions, Labs)     │                        │                          │
  │                         ├─ Prescribe Plan ───────►                          │
  │                         │  (Calories, Macros)    │                          │
  │                         │                        ├─ Log Meals & Water ──────┤
  │                         │                        ├─ Report Barriers ────────┤
  │                         │                        ├─ Order Kitchen Meals ────►
  │                         │                        │                          ├─ Prepare & Deliver
  │                         ◄── Reality Score & ─────┤                          │
  │                         │   Adaptive Warnings    │                          │
  │                         ├─ Review & Adjust ──────►                          │
```

### 1. Clinical Ingestion
1. Doctor logs in and inputs medical diagnosis (e.g. Type 2 Diabetes, Hypertension) and laboratory blood panels (HbA1c, Lipid Profile, Creatinine).
2. The diagnosis triggers medical constraint flags linked to the patient record.

### 2. Dietary Prescription
1. Dietitian calculates nutritional requirements based on metabolic state and clinical condition.
2. Dietitian authors a structured diet plan with target calories, macro distributions, and meal schedules.

### 3. Patient Daily Execution & Reality Loop
1. Patient logs food and water intake throughout the day.
2. If unable to cook, Patient activates **Home Food Mode** for pantry suggestions or orders a clinically aligned meal from the **Hotel Kitchen**.
3. If an obstacle arises, Patient logs an **Adherence Barrier**.
4. The **Reality Score Engine** and **Adaptive Engine** process the inputs continuously.

### 4. Adaptation & Supervision
1. When recurrent barriers or hydration deficits are detected, the Adaptive Engine creates an advisory change ticket.
2. The Dietitian reviews the ticket, approves or adjusts parameters, ensuring clinical safety.
