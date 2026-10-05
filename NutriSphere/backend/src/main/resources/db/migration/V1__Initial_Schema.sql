
    create table adaptive_recommendations (
        created_at datetime(6),
        diet_plan_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        reviewed_at datetime(6),
        reviewed_by_user_id bigint,
        updated_at datetime(6),
        review_notes varchar(500),
        detected_issues varchar(1000),
        description varchar(2000) not null,
        suggested_changes varchar(2000),
        priority varchar(255),
        recommendation_type varchar(255) not null,
        title varchar(255) not null,
        status enum ('APPROVED','IMPLEMENTED','PENDING_REVIEW','REJECTED') not null,
        primary key (id)
    ) engine=InnoDB;

    create table adherence_barriers (
        barrier_date date,
        created_at datetime(6),
        diet_plan_meal_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        description varchar(500),
        barrier_type varchar(255) not null,
        meal_type varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table audit_logs (
        created_at datetime(6),
        entity_id bigint,
        id bigint not null auto_increment,
        updated_at datetime(6),
        user_id bigint,
        description varchar(500),
        action varchar(255) not null,
        entity_type varchar(255),
        ip_address varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table consultations (
        consultation_date date,
        follow_up_date date,
        created_at datetime(6),
        doctor_user_id bigint not null,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        chief_complaint varchar(500),
        diagnosis varchar(500),
        treatment_plan varchar(1000),
        notes varchar(2000),
        status varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table diet_plan_meals (
        sort_order integer,
        created_at datetime(6),
        diet_plan_id bigint not null,
        id bigint not null auto_increment,
        updated_at datetime(6),
        notes varchar(500),
        day_of_week varchar(255),
        meal_name varchar(255),
        meal_type varchar(255) not null,
        scheduled_time varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table diet_plans (
        end_date date,
        start_date date,
        target_calories float(53),
        target_carbs_g float(53),
        target_fat_g float(53),
        target_fiber_g float(53),
        target_protein_g float(53),
        target_water_ml float(53),
        approved_at datetime(6),
        created_at datetime(6),
        dietitian_user_id bigint not null,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        description varchar(1000),
        notes varchar(2000),
        title varchar(255) not null,
        status enum ('APPROVED','ARCHIVED','DRAFT','REJECTED','SUBMITTED') not null,
        primary key (id)
    ) engine=InnoDB;

    create table dietitian_patient (
        assigned_date date,
        is_active bit,
        created_at datetime(6),
        dietitian_user_id bigint not null,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table dietitian_profiles (
        consultation_fee float(53),
        years_experience integer,
        created_at datetime(6),
        id bigint not null auto_increment,
        updated_at datetime(6),
        user_id bigint not null,
        bio varchar(1000),
        clinic_address varchar(255),
        clinic_name varchar(255),
        license_number varchar(255),
        specialization varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table doctor_patient (
        assigned_date date,
        is_active bit,
        created_at datetime(6),
        doctor_user_id bigint not null,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table doctor_profiles (
        consultation_fee float(53),
        years_experience integer,
        created_at datetime(6),
        id bigint not null auto_increment,
        updated_at datetime(6),
        user_id bigint not null,
        bio varchar(1000),
        hospital_address varchar(255),
        hospital_name varchar(255),
        license_number varchar(255),
        specialization varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table food_items (
        calories_per_100g float(53),
        carbs_g float(53),
        fat_g float(53),
        fiber_g float(53),
        is_active bit,
        protein_g float(53),
        serving_size_g float(53),
        sodium_mg float(53),
        sugar_g float(53),
        created_at datetime(6),
        id bigint not null auto_increment,
        updated_at datetime(6),
        brand varchar(255),
        category varchar(255),
        external_id varchar(255),
        image_url varchar(255),
        name varchar(255) not null,
        serving_description varchar(255),
        source varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table food_logs (
        calories float(53),
        carbs_g float(53),
        fat_g float(53),
        fiber_g float(53),
        log_date date not null,
        log_time time(6),
        protein_g float(53),
        quantity_g float(53),
        created_at datetime(6),
        diet_plan_meal_id bigint,
        food_item_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        food_name varchar(255) not null,
        meal_type varchar(255),
        notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table food_nutrients (
        nutrient_value float(53),
        created_at datetime(6),
        food_item_id bigint,
        id bigint not null auto_increment,
        updated_at datetime(6),
        nutrient_name varchar(255),
        unit varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table home_food_inventory (
        expiry_date date,
        is_available bit,
        quantity_g float(53),
        created_at datetime(6),
        food_item_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        category varchar(255),
        food_name varchar(255) not null,
        unit varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table hotel_availability (
        is_available bit,
        max_orders integer,
        created_at datetime(6),
        hotel_user_id bigint not null,
        id bigint not null auto_increment,
        meal_id bigint not null,
        updated_at datetime(6),
        day_of_week varchar(255),
        end_time varchar(255),
        start_time varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table hotel_categories (
        is_active bit,
        sort_order integer,
        created_at datetime(6),
        hotel_user_id bigint not null,
        id bigint not null auto_increment,
        updated_at datetime(6),
        description varchar(255),
        name varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table hotel_meals (
        calories float(53),
        carbs_g float(53),
        fat_g float(53),
        is_available bit,
        is_vegan bit,
        is_vegetarian bit,
        preparation_time_min integer,
        price float(53) not null,
        protein_g float(53),
        category_id bigint,
        created_at datetime(6),
        hotel_user_id bigint not null,
        id bigint not null auto_increment,
        updated_at datetime(6),
        allergens varchar(500),
        description varchar(500),
        image_url varchar(255),
        name varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table hotel_order_items (
        quantity integer not null,
        total_price float(53),
        unit_price float(53) not null,
        created_at datetime(6),
        id bigint not null auto_increment,
        meal_id bigint,
        order_id bigint not null,
        updated_at datetime(6),
        meal_name varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table hotel_orders (
        total_amount float(53) not null,
        created_at datetime(6),
        hotel_user_id bigint not null,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        special_instructions varchar(500),
        delivery_address varchar(255),
        notes varchar(255),
        status enum ('CANCELLED','COMPLETED','CONFIRMED','PENDING','PREPARING','READY') not null,
        primary key (id)
    ) engine=InnoDB;

    create table hotel_profiles (
        is_active bit,
        created_at datetime(6),
        id bigint not null auto_increment,
        updated_at datetime(6),
        user_id bigint not null,
        description varchar(500),
        cuisine_type varchar(255),
        hotel_address varchar(255),
        hotel_name varchar(255) not null,
        phone_number varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table meal_deviations (
        deviation_date date,
        created_at datetime(6),
        diet_plan_meal_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        actual_food varchar(500),
        notes varchar(500),
        reason varchar(500),
        primary key (id)
    ) engine=InnoDB;

    create table meal_items (
        calories float(53),
        carbs_g float(53),
        fat_g float(53),
        protein_g float(53),
        quantity_g float(53),
        created_at datetime(6),
        diet_plan_meal_id bigint not null,
        food_item_id bigint,
        id bigint not null auto_increment,
        updated_at datetime(6),
        food_name varchar(255) not null,
        notes varchar(255),
        serving_description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table medical_history (
        diagnosis_date date,
        is_active bit,
        created_at datetime(6),
        doctor_user_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        medications varchar(500),
        treatment varchar(500),
        description varchar(1000),
        condition_name varchar(255) not null,
        status varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table medical_reports (
        report_date date,
        created_at datetime(6),
        file_size bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        uploaded_by_user_id bigint,
        description varchar(500),
        notes varchar(500),
        file_name varchar(255),
        file_path varchar(255),
        report_type varchar(255),
        title varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table notifications (
        is_read bit,
        created_at datetime(6),
        id bigint not null auto_increment,
        reference_id bigint,
        updated_at datetime(6),
        user_id bigint not null,
        message varchar(1000) not null,
        reference_type varchar(255),
        title varchar(255) not null,
        type enum ('ADHERENCE_ALERT','ASSIGNMENT','BARRIER_ANALYSIS','CONSULTATION','DIET_PLAN_APPROVED','DIET_PLAN_UPDATED','FOOD_LOG_REMINDER','GENERAL','ORDER_UPDATE','RECOMMENDATION_REVIEW') not null,
        primary key (id)
    ) engine=InnoDB;

    create table nutrition_assessments (
        assessment_date date,
        bmi float(53),
        body_fat_percent float(53),
        height_cm float(53),
        hip_cm float(53),
        muscle_mass_kg float(53),
        waist_cm float(53),
        weight_kg float(53),
        created_at datetime(6),
        dietitian_user_id bigint not null,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        chief_complaint varchar(500),
        food_allergies varchar(500),
        supplements varchar(500),
        dietary_habits varchar(1000),
        notes varchar(2000),
        primary key (id)
    ) engine=InnoDB;

    create table nutrition_digital_twin (
        created_at datetime(6),
        id bigint not null auto_increment,
        last_updated datetime(6),
        patient_user_id bigint not null,
        updated_at datetime(6),
        snapshot_json TEXT,
        primary key (id)
    ) engine=InnoDB;

    create table nutrition_requirements (
        calories_target float(53),
        carbs_g_target float(53),
        fat_g_target float(53),
        fiber_g_target float(53),
        is_active bit,
        protein_g_target float(53),
        water_ml_target float(53),
        created_at datetime(6),
        dietitian_user_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        notes varchar(500),
        calculation_method varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table order_status_history (
        changed_by_user_id bigint,
        created_at datetime(6),
        id bigint not null auto_increment,
        order_id bigint not null,
        updated_at datetime(6),
        notes varchar(255),
        status enum ('CANCELLED','COMPLETED','CONFIRMED','PENDING','PREPARING','READY') not null,
        primary key (id)
    ) engine=InnoDB;

    create table patient_measurements (
        bmi float(53),
        body_fat_percent float(53),
        height_cm float(53),
        hip_cm float(53),
        measurement_date date not null,
        muscle_mass_kg float(53),
        waist_cm float(53),
        weight_kg float(53),
        created_at datetime(6),
        id bigint not null auto_increment,
        measured_by_user_id bigint,
        patient_user_id bigint not null,
        updated_at datetime(6),
        notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table patient_profiles (
        date_of_birth date,
        height_cm float(53),
        weight_kg float(53),
        created_at datetime(6),
        id bigint not null auto_increment,
        updated_at datetime(6),
        user_id bigint not null,
        allergies varchar(500),
        dietary_restrictions varchar(500),
        food_preferences varchar(500),
        address varchar(255),
        blood_type varchar(255),
        emergency_contact_name varchar(255),
        emergency_contact_phone varchar(255),
        occupation varchar(255),
        activity_level enum ('EXTRA_ACTIVE','LIGHTLY_ACTIVE','MODERATELY_ACTIVE','SEDENTARY','VERY_ACTIVE'),
        gender enum ('FEMALE','MALE','OTHER'),
        primary key (id)
    ) engine=InnoDB;

    create table progress_records (
        adherence_percent float(53),
        calories_consumed float(53),
        record_date date,
        water_consumed_ml float(53),
        created_at datetime(6),
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        notes varchar(500),
        primary key (id)
    ) engine=InnoDB;

    create table reality_scores (
        accessibility_score float(53),
        affordability_score float(53),
        cooking_complexity_score float(53),
        food_availability_score float(53),
        historical_adherence_score float(53),
        overall_score float(53),
        preference_score float(53),
        schedule_score float(53),
        created_at datetime(6),
        diet_plan_id bigint,
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        explanation varchar(1000),
        primary key (id)
    ) engine=InnoDB;

    create table stored_files (
        created_at datetime(6),
        entity_id bigint,
        file_size bigint,
        id bigint not null auto_increment,
        updated_at datetime(6),
        uploader_user_id bigint,
        category varchar(255),
        content_type varchar(255),
        entity_type varchar(255),
        file_path varchar(255) not null,
        original_filename varchar(255) not null,
        stored_filename varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        email_verified bit,
        created_at datetime(6),
        id bigint not null auto_increment,
        last_login_at datetime(6),
        password_reset_expires datetime(6),
        updated_at datetime(6),
        email varchar(255) not null,
        email_verify_token varchar(255),
        first_name varchar(255) not null,
        last_name varchar(255) not null,
        password_hash varchar(255) not null,
        password_reset_token varchar(255),
        phone_number varchar(255),
        profile_image_url varchar(255),
        refresh_token varchar(255),
        role enum ('DIETITIAN','DOCTOR','HOTEL','PATIENT') not null,
        status enum ('ACTIVE','INACTIVE','PENDING','SUSPENDED') not null,
        primary key (id)
    ) engine=InnoDB;

    create table water_logs (
        amount_ml float(53) not null,
        log_date date not null,
        log_time time(6),
        created_at datetime(6),
        id bigint not null auto_increment,
        patient_user_id bigint not null,
        updated_at datetime(6),
        notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    alter table dietitian_patient 
       add constraint UK1y7v5suyk79e0nn98yrn50pnv unique (dietitian_user_id, patient_user_id);

    alter table dietitian_profiles 
       add constraint UK73cfc3uasopemfvkuwkdlbl9w unique (user_id);

    alter table dietitian_profiles 
       add constraint UK4p1icnkv1afh7r05hhf1tde0l unique (license_number);

    alter table doctor_patient 
       add constraint UK4j7dsmemfc1vpjtcqstacch68 unique (doctor_user_id, patient_user_id);

    alter table doctor_profiles 
       add constraint UKf2ac4saatw7tnup2kqa53oqkl unique (user_id);

    alter table doctor_profiles 
       add constraint UKlfhrhro6r3sajly4jo7sfmsvw unique (license_number);

    alter table hotel_profiles 
       add constraint UKqqoathgpkmhoddknhvu9p5m7y unique (user_id);

    alter table nutrition_digital_twin 
       add constraint UKp5cx7qelo1ta3s3q7oxo1g9s6 unique (patient_user_id);

    alter table patient_profiles 
       add constraint UKm1vq601k5agscsnei45j7bcv1 unique (user_id);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table diet_plan_meals 
       add constraint FK4mt4ee0ns60aof5ovh6u3j2yf 
       foreign key (diet_plan_id) 
       references diet_plans (id);

    alter table dietitian_profiles 
       add constraint FK8f9knw0twbrs2japx9tspffcp 
       foreign key (user_id) 
       references users (id);

    alter table doctor_profiles 
       add constraint FKhrpk2q09sjwf9en18301dioyr 
       foreign key (user_id) 
       references users (id);

    alter table food_nutrients 
       add constraint FK5ssss364j2yyvratymvjnuc5u 
       foreign key (food_item_id) 
       references food_items (id);

    alter table hotel_order_items 
       add constraint FKiqmsbi0ev1xvtmu1xn95t0ihl 
       foreign key (order_id) 
       references hotel_orders (id);

    alter table hotel_profiles 
       add constraint FK6d1olouvfego85hbjcqq727sc 
       foreign key (user_id) 
       references users (id);

    alter table meal_items 
       add constraint FKuo3er2e60uaxpa9f7gibjklk 
       foreign key (diet_plan_meal_id) 
       references diet_plan_meals (id);

    alter table patient_profiles 
       add constraint FK48bdvcabhgaa1bqphn9jijwn2 
       foreign key (user_id) 
       references users (id);
