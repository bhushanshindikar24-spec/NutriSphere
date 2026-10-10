-- HealthyOne / NutriSphere: Adherence Calculation Functions

DELIMITER $$

DROP FUNCTION IF EXISTS fn_calculate_patient_adherence $$
CREATE FUNCTION fn_calculate_patient_adherence(p_patient_id BIGINT, p_days INT)
RETURNS FLOAT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_adherence FLOAT DEFAULT 0.0;
    DECLARE v_logged_days INT DEFAULT 0;
    
    SELECT COUNT(DISTINCT log_date) INTO v_logged_days
    FROM food_logs
    WHERE patient_user_id = p_patient_id
      AND log_date >= DATE_SUB(CURDATE(), INTERVAL p_days DAY);
      
    IF p_days > 0 THEN
        SET v_adherence = LEAST(100.0, (v_logged_days / p_days) * 100.0);
    END IF;
    
    RETURN v_adherence;
END $$

DROP FUNCTION IF EXISTS fn_get_dominant_barrier $$
CREATE FUNCTION fn_get_dominant_barrier(p_patient_id BIGINT, p_days INT)
RETURNS VARCHAR(255)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_dominant_barrier VARCHAR(255) DEFAULT 'NONE';
    
    SELECT barrier_type INTO v_dominant_barrier
    FROM adherence_barriers
    WHERE patient_user_id = p_patient_id
      AND barrier_date >= DATE_SUB(CURDATE(), INTERVAL p_days DAY)
    GROUP BY barrier_type
    ORDER BY COUNT(*) DESC
    LIMIT 1;
    
    RETURN v_dominant_barrier;
END $$

DELIMITER ;
