# NutriSphere — Database Relationships & Foreign Keys

## Relational Invariants

### 1. User Account Cardinality
- Every user in `users` has a corresponding role-specific profile row in either `patient_profiles`, `dietitian_profiles`, `doctor_profiles`, or `hotel_profiles`.
- Role assignment links: `doctor_patient` and `dietitian_patient` bridge care teams to patients via composite unique indexes `(doctor_user_id, patient_user_id)` and `(dietitian_user_id, patient_user_id)`.

### 2. Clinical Care Cascade
- `diet_plans` links to `patient_user_id` and authoring `dietitian_user_id`.
- Cascade deletion: Deleting a `diet_plan` cascades to `diet_plan_meals` and `meal_items`.
- Deleting an order in `hotel_orders` cascades to `hotel_order_items` and `order_status_history`.

### 3. Audit & Diagnostics Decoupling
- Diagnostic records (`medical_history`, `medical_reports`, `laboratory_reports`, `patient_conditions`) are soft-linked to prevent accidental data loss if a clinician account is deactivated.
- `audit_logs` are immutable and have no foreign key cascades to ensure forensic integrity.
