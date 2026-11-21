-- Per-consultation verification OTP (replaces the former hardcoded "1234")
ALTER TABLE consultations ADD COLUMN verification_otp VARCHAR(10) NULL;

UPDATE consultations
   SET verification_otp = LPAD(FLOOR(RAND() * 10000), 4, '0')
 WHERE verification_otp IS NULL;
