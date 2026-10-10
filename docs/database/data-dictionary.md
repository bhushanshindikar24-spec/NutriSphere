# NutriSphere — Data Dictionary

## Core Tables Overview

### 1. `users`
- `id` (BIGINT, PK, AUTO_INCREMENT): Unique user identifier.
- `email` (VARCHAR(255), UNIQUE, NOT NULL): User login email.
- `password` (VARCHAR(255), NOT NULL): BCrypt hashed password.
- `role` (ENUM, NOT NULL): `PATIENT`, `DIETITIAN`, `DOCTOR`, `HOTEL`.
- `status` (VARCHAR(50)): `ACTIVE`, `INACTIVE`, `SUSPENDED`.

### 2. `diet_plans`
- `id` (BIGINT, PK): Plan identifier.
- `patient_user_id` (BIGINT, FK -> users): Assigned patient.
- `dietitian_user_id` (BIGINT, FK -> users): Authoring dietitian.
- `name` (VARCHAR(255), NOT NULL): Plan title.
- `status` (ENUM): `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `ARCHIVED`.
- `target_calories` (DOUBLE): Daily caloric target.
- `target_protein_g` (DOUBLE): Daily protein target.
- `target_carbs_g` (DOUBLE): Daily carbohydrate target.
- `target_fat_g` (DOUBLE): Daily fat target.

### 3. `reality_scores`
- `id` (BIGINT, PK): Reality score computation record.
- `patient_user_id` (BIGINT, FK): Patient evaluated.
- `overall_score` (DOUBLE): Composite score (0–100).
- `dimension_scores` (TEXT): JSON breakdown of the 6 dimensions.
- `interpretation` (VARCHAR(255)): Feasibility category.

### 4. `adherence_barriers`
- `id` (BIGINT, PK): Barrier event log.
- `patient_user_id` (BIGINT, FK): Patient experiencing barrier.
- `barrier_type` (VARCHAR(255)): e.g. `TIME_CONSTRAINT`, `COST`, `FOOD_UNAVAILABLE`.
- `meal_type` (VARCHAR(255)): `BREAKFAST`, `LUNCH`, `DINNER`, `SNACK`.
- `barrier_date` (DATE): Date of occurrence.

### 5. `hotel_orders`
- `id` (BIGINT, PK): Order identifier.
- `patient_user_id` (BIGINT, FK): Customer patient.
- `hotel_user_id` (BIGINT, FK): Fulfilling kitchen.
- `status` (ENUM): `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`.
- `total_amount` (DOUBLE): Total cost.
- `delivery_address` (VARCHAR(500)): Patient room/delivery location.
