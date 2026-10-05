CREATE TABLE IF NOT EXISTS health_conditions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    category VARCHAR(255),
    icd_code VARCHAR(255),
    is_active BIT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS patient_conditions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_user_id BIGINT NOT NULL,
    condition_id BIGINT,
    condition_name VARCHAR(255) NOT NULL,
    diagnosed_date DATE,
    severity VARCHAR(255),
    notes VARCHAR(500),
    is_active BIT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS laboratory_reports (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_user_id BIGINT NOT NULL,
    doctor_user_id BIGINT,
    report_date DATE,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(255),
    notes VARCHAR(1000),
    file_path VARCHAR(255),
    file_name VARCHAR(255),
    file_size BIGINT,
    status VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS laboratory_values (
    id BIGINT NOT NULL AUTO_INCREMENT,
    report_id BIGINT NOT NULL,
    parameter_name VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    unit VARCHAR(255),
    normal_range VARCHAR(255),
    flag VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB;
