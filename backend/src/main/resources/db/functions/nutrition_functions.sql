-- HealthyOne / NutriSphere: Deterministic Nutrition Functions

DELIMITER $$

DROP FUNCTION IF EXISTS fn_calculate_bmr_mifflin $$
CREATE FUNCTION fn_calculate_bmr_mifflin(
    p_weight_kg FLOAT,
    p_height_cm FLOAT,
    p_age_years INT,
    p_gender VARCHAR(10)
)
RETURNS FLOAT
DETERMINISTIC
CONTAINS SQL
BEGIN
    DECLARE v_bmr FLOAT DEFAULT 0.0;
    
    -- Mifflin-St Jeor formula:
    -- Men: 10 * W + 6.25 * H - 5 * A + 5
    -- Women: 10 * W + 6.25 * H - 5 * A - 161
    IF UPPER(p_gender) = 'MALE' THEN
        SET v_bmr = (10.0 * p_weight_kg) + (6.25 * p_height_cm) - (5.0 * p_age_years) + 5.0;
    ELSE
        SET v_bmr = (10.0 * p_weight_kg) + (6.25 * p_height_cm) - (5.0 * p_age_years) - 161.0;
    END IF;
    
    RETURN GREATEST(500.0, v_bmr);
END $$

DROP FUNCTION IF EXISTS fn_calculate_bmr_harris_benedict $$
CREATE FUNCTION fn_calculate_bmr_harris_benedict(
    p_weight_kg FLOAT,
    p_height_cm FLOAT,
    p_age_years INT,
    p_gender VARCHAR(10)
)
RETURNS FLOAT
DETERMINISTIC
CONTAINS SQL
BEGIN
    DECLARE v_bmr FLOAT DEFAULT 0.0;
    
    -- Revised Harris-Benedict:
    -- Men: 88.362 + (13.397 * W) + (4.799 * H) - (5.677 * A)
    -- Women: 447.593 + (9.247 * W) + (3.098 * H) - (4.330 * A)
    IF UPPER(p_gender) = 'MALE' THEN
        SET v_bmr = 88.362 + (13.397 * p_weight_kg) + (4.799 * p_height_cm) - (5.677 * p_age_years);
    ELSE
        SET v_bmr = 447.593 + (9.247 * p_weight_kg) + (3.098 * p_height_cm) - (4.330 * p_age_years);
    END IF;
    
    RETURN GREATEST(500.0, v_bmr);
END $$

DELIMITER ;
