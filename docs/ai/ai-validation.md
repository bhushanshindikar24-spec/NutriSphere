# NutriSphere — AI Validation & Verification Framework

## Validation Methodology
All intelligence calculations in NutriSphere undergo multi-tiered automated verification:

1. **Unit Verification**:
   - Mifflin-St Jeor formula unit tests against standard clinical baseline matrices.
   - 6-dimension Reality Score normalization ($0 \le score \le 100$).
   - Weight trajectory projection convergence tests.

2. **Integration Verification**:
   - `AdaptiveEngineService` generates suggestions only when logs exist.
   - Status defaults to `PENDING_REVIEW` in repository persistence.
   - Dietitian approval alters status to `APPROVED` and attaches audit metadata (`reviewedByUserId`, `reviewedAt`, `reviewNotes`).

3. **Runtime Test Verification Table**:

| Test Case | Input | Expected Output | Status |
|---|---|---|---|
| Reality Score Baseline | Empty logs | 72.5 (Moderate Feasibility) | PASS |
| Barrier Impact | +1 `TIME_CONSTRAINT` | Score adjusts, Dominant barrier updated | PASS |
| Hydration Detection | Avg water < 1500ml | `[PENDING_REVIEW] Low Hydration Pattern` | PASS |
| Clinician Approval | Dietitian calls `/approve` | Status transitions to `APPROVED` | PASS |
| Pantry Matching | Added "Oats" (500g) | Generated Oats Porridge suggestion | PASS |
