# NutriSphere — Functional Requirements Specification (FRS)

## 1. User Management & Authentication
- **FR-1.1**: System must support registration and authentication for 4 distinct roles: Doctor, Dietitian, Patient, and Hotel Kitchen.
- **FR-1.2**: JWT tokens must expire after 24 hours and support refresh tokens valid for 7 days.

## 2. Dietary Planning & Execution
- **FR-2.1**: Dietitians must be able to create structured multi-meal diet plans with specific calorie and macronutrient allocations.
- **FR-2.2**: Patients must be able to log consumed meals, water intake, and record adherence deviations.

## 3. Intelligence Engines
- **FR-3.1**: The Reality Score must compute a 0–100 score across 6 feasibility dimensions.
- **FR-3.2**: The Adaptive Engine must flag nutritional gaps and hydration deficits with `PENDING_REVIEW` tickets requiring Dietitian approval.
- **FR-3.3**: Home Food Mode must accept pantry inventory and generate recipe recommendations matching the patient's daily targets.
- **FR-3.4**: The Digital Twin must simulate and graph 30-day weight trajectory curves.

## 4. Medical Diagnostics & Records
- **FR-4.1**: Doctors must be able to record clinical conditions with severity levels.
- **FR-4.2**: Doctors must be able to record quantitative laboratory values (e.g. glucose, HbA1c, lipid panel).

## 5. Culinary Hotel Kitchen
- **FR-5.1**: Hotel kitchens must be able to publish meal menus with calories, macros, and allergen warnings.
- **FR-5.2**: Patients must be able to order meals for room delivery, and kitchen staff must be able to update status from `CONFIRMED` to `COMPLETED`.
