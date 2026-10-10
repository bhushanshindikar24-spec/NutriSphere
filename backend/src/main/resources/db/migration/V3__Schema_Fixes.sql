-- Fixes for entity-to-Flyway schema mismatches
-- Verify LocalDateTime/timestamp mappings

ALTER TABLE consultations ADD COLUMN blood_pressure VARCHAR(50);
ALTER TABLE consultations ADD COLUMN clinical_notes VARCHAR(2000);
ALTER TABLE consultations MODIFY COLUMN consultation_date DATETIME(6);
ALTER TABLE consultations ADD COLUMN dietary_directives VARCHAR(2000);
ALTER TABLE consultations MODIFY COLUMN follow_up_date DATETIME(6);
ALTER TABLE consultations ADD COLUMN heart_rate VARCHAR(50);
ALTER TABLE consultations ADD COLUMN icd_code VARCHAR(50);

ALTER TABLE nutrition_digital_twin MODIFY COLUMN snapshot_json TEXT;
