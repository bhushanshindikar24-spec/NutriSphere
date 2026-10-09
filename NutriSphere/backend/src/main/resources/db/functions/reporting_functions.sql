-- HealthyOne / NutriSphere: Clinical Reporting SQL Functions

DELIMITER $$

DROP FUNCTION IF EXISTS fn_get_patient_avg_protein_7d $$
CREATE FUNCTION fn_get_patient_avg_protein_7d(p_patient_id BIGINT)
RETURNS FLOAT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_avg_protein FLOAT DEFAULT 0.0;
    
    SELECT IFNULL(AVG(daily_p), 0.0) INTO v_avg_protein
    FROM (
        SELECT log_date, SUM(protein_g) as daily_p
        FROM food_logs
        WHERE patient_user_id = p_patient_id
          AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY log_date
    ) t;
    
    RETURN v_avg_protein;
END $$

DROP FUNCTION IF EXISTS fn_get_patient_avg_water_7d $$
CREATE FUNCTION fn_get_patient_avg_water_7d(p_patient_id BIGINT)
RETURNS FLOAT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_avg_water FLOAT DEFAULT 0.0;
    
    SELECT IFNULL(AVG(daily_w), 0.0) INTO v_avg_water
    FROM (
        SELECT log_date, SUM(amount_ml) as daily_w
        FROM water_logs
        WHERE patient_user_id = p_patient_id
          AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY log_date
    ) t;
    
    RETURN v_avg_water;
END $$

DELIMITER ;
