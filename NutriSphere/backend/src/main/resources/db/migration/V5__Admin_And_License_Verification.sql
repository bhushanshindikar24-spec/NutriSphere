-- V5: Admin Role and Professional License Verification Schema Support

ALTER TABLE users MODIFY COLUMN role VARCHAR(32) NOT NULL;

ALTER TABLE doctor_profiles 
    ADD COLUMN degree VARCHAR(255) NULL,
    ADD COLUMN achievements VARCHAR(1000) NULL,
    ADD COLUMN license_document_url VARCHAR(500) NULL,
    ADD COLUMN verification_status VARCHAR(50) DEFAULT 'APPROVED';

ALTER TABLE dietitian_profiles 
    ADD COLUMN degree VARCHAR(255) NULL,
    ADD COLUMN achievements VARCHAR(1000) NULL,
    ADD COLUMN license_document_url VARCHAR(500) NULL,
    ADD COLUMN verification_status VARCHAR(50) DEFAULT 'APPROVED';

ALTER TABLE hotel_profiles 
    ADD COLUMN license_number VARCHAR(255) NULL,
    ADD COLUMN license_document_url VARCHAR(500) NULL,
    ADD COLUMN verification_status VARCHAR(50) DEFAULT 'APPROVED';
