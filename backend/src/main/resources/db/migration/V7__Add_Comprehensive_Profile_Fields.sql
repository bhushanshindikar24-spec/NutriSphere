-- V7: Add comprehensive clinical, lifestyle, and dietary fields to patient_profiles

ALTER TABLE patient_profiles
    ADD COLUMN blood_pressure VARCHAR(50) NULL,
    ADD COLUMN resting_heart_rate INT NULL,
    ADD COLUMN diagnosed_conditions VARCHAR(1000) NULL,
    ADD COLUMN current_symptoms VARCHAR(1000) NULL,
    ADD COLUMN previous_surgeries VARCHAR(1000) NULL,
    ADD COLUMN family_medical_history VARCHAR(1000) NULL,
    ADD COLUMN current_medications VARCHAR(1000) NULL,
    ADD COLUMN vitamins_supplements VARCHAR(1000) NULL,
    ADD COLUMN food_intolerances VARCHAR(500) NULL,
    ADD COLUMN meals_per_day VARCHAR(50) NULL,
    ADD COLUMN meal_timings VARCHAR(500) NULL,
    ADD COLUMN typical_food_intake VARCHAR(2000) NULL,
    ADD COLUMN exercise_type VARCHAR(255) NULL,
    ADD COLUMN exercise_frequency_duration VARCHAR(255) NULL,
    ADD COLUMN smoking_tobacco VARCHAR(100) NULL,
    ADD COLUMN alcohol_consumption VARCHAR(100) NULL;
