# NutriSphere — Database Schema Architecture

## Schema Migrations
The database schema is managed via Flyway versioned migrations:
- `V1__Initial_Schema.sql`: Creates core user accounts, diet plans, food logs, water logs, requirements, assessments, hotel orders, and baseline tables (36 tables).
- `V2__Medical_Conditions_And_Lab_Reports.sql`: Adds medical diagnostics (`health_conditions`, `patient_conditions`, `laboratory_reports`, `laboratory_values`).

---

## Complete Table Catalog (40 Relational Tables)

| Category | Table Names |
|---|---|
| **Identity & Security** | `users`, `audit_logs`, `notifications`, `stored_files` |
| **User Profiles** | `patient_profiles`, `dietitian_profiles`, `doctor_profiles`, `hotel_profiles` |
| **Care Assignments** | `doctor_patient`, `dietitian_patient` |
| **Nutrition Prescription** | `diet_plans`, `diet_plan_meals`, `meal_items`, `nutrition_requirements`, `nutrition_assessments` |
| **Intake Tracking** | `food_logs`, `water_logs`, `meal_deviations`, `patient_measurements`, `progress_records` |
| **Food Knowledge Base** | `food_items`, `food_nutrients` |
| **Clinical Intelligence**| `reality_scores`, `adaptive_recommendations`, `adherence_barriers`, `home_food_inventory`, `nutrition_digital_twin` |
| **Medical Diagnostics** | `health_conditions`, `patient_conditions`, `consultations`, `medical_history`, `medical_reports`, `laboratory_reports`, `laboratory_values` |
| **Hotel & Culinary** | `hotel_categories`, `hotel_meals`, `hotel_availability`, `hotel_orders`, `hotel_order_items`, `order_status_history` |
| **Schema History** | `flyway_schema_history` |
