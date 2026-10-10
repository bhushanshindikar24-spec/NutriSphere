-- HealthyOne / NutriSphere: Performance Optimization Indexes

-- Index for patient food logging queries (daily logs, rolling 7-day stats)
CREATE INDEX idx_food_logs_patient_date ON food_logs(patient_user_id, log_date);

-- Index for patient water logging queries
CREATE INDEX idx_water_logs_patient_date ON water_logs(patient_user_id, log_date);

-- Index for adherence barrier lookups
CREATE INDEX idx_barriers_patient_date ON adherence_barriers(patient_user_id, barrier_date);

-- Index for diet plan patient lookups
CREATE INDEX idx_diet_plans_patient_status ON diet_plans(patient_user_id, status);

-- Index for hotel order lookups
CREATE INDEX idx_hotel_orders_patient ON hotel_orders(patient_user_id, order_status);
CREATE INDEX idx_hotel_orders_hotel ON hotel_orders(hotel_user_id, order_status);

-- Index for doctor and dietitian patient assignments
CREATE INDEX idx_doctor_patient_lookup ON doctor_patient(doctor_user_id, patient_user_id, is_active);
CREATE INDEX idx_dietitian_patient_lookup ON dietitian_patient(dietitian_user_id, patient_user_id, is_active);
