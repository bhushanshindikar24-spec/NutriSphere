# NutriSphere — User Roles & Permissions Matrix

## Role Definitions

### 1. `ROLE_PATIENT`
- Target: Individual receiving dietary care and culinary management.
- Capabilities:
  - View assigned approved diet plans.
  - Log daily food intake, meal deviations, and water volume.
  - Record adherence barriers.
  - Manage pantry inventory and view Home Food Mode recipe suggestions.
  - Inspect personal Reality Score breakdowns and Digital Twin projections.
  - Browse hotel menus, place room delivery orders, track fulfillment.

### 2. `ROLE_DIETITIAN`
- Target: Clinical nutritionist or registered dietitian.
- Capabilities:
  - Manage patient clinical caseloads.
  - Calculate metabolic requirements (BMR, TDEE, macro splits).
  - Create, edit, and approve structured diet plans.
  - Inspect patient food logs, adherence percentages, and barrier root causes.
  - Review, approve, or reject Adaptive Diet Engine recommendations.

### 3. `ROLE_DOCTOR`
- Target: Attending physician or clinical specialist.
- Capabilities:
  - Inspect patient health profiles and progress trajectories.
  - Register clinical conditions (ICD-coded diagnoses, severity).
  - Create and review laboratory reports and biomarker values.
  - Record consultation encounter notes and follow-up schedules.

### 4. `ROLE_HOTEL`
- Target: Culinary kitchen supervisor, chef, or hotel wellness coordinator.
- Capabilities:
  - Curate meal catalog with pricing, preparation time, calories, macros, and allergens.
  - Manage meal availability windows and category groupings.
  - Monitor incoming room orders and update delivery progression (`CONFIRMED` -> `PREPARING` -> `READY` -> `COMPLETED`).
