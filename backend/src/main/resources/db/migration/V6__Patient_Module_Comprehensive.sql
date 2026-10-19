-- V6: Comprehensive Patient Module Schema Additions & Seeds

-- 1. Patient Profile Additions for detailed assessment
ALTER TABLE patient_profiles
    ADD COLUMN dietary_preference VARCHAR(100) NULL,
    ADD COLUMN current_water_intake_liters DOUBLE NULL,
    ADD COLUMN health_goals VARCHAR(500) NULL,
    ADD COLUMN nutritional_requirements VARCHAR(1000) NULL,
    ADD COLUMN target_daily_calories DOUBLE NULL,
    ADD COLUMN target_daily_water_ml DOUBLE NULL;

-- 2. Medical Condition-Based Food Restrictions
ALTER TABLE health_conditions
    ADD COLUMN dietary_restrictions VARCHAR(1000) NULL,
    ADD COLUMN foods_to_avoid VARCHAR(1000) NULL,
    ADD COLUMN recommended_foods VARCHAR(1000) NULL,
    ADD COLUMN recommended_alternatives VARCHAR(1000) NULL,
    ADD COLUMN clinical_guidelines VARCHAR(1000) NULL;

-- 3. Detailed Medical and Hereditary History Collection
ALTER TABLE medical_history
    ADD COLUMN severity VARCHAR(100) NULL,
    ADD COLUMN ongoing_treatments VARCHAR(1000) NULL,
    ADD COLUMN past_surgeries VARCHAR(1000) NULL,
    ADD COLUMN relevant_symptoms VARCHAR(1000) NULL,
    ADD COLUMN family_members_affected VARCHAR(500) NULL,
    ADD COLUMN hereditary_risk_factors VARCHAR(1000) NULL,
    ADD COLUMN family_history_details VARCHAR(1000) NULL;

-- 4. Consultation Prescriptions and Clinical Details
ALTER TABLE consultations
    ADD COLUMN symptoms_discussed VARCHAR(1000) NULL,
    ADD COLUMN prescribed_medicines VARCHAR(2000) NULL,
    ADD COLUMN follow_up_instructions VARCHAR(1000) NULL;

-- 5. Blood Report AI Analysis and Doctor Review Notes
ALTER TABLE laboratory_reports
    ADD COLUMN ai_summary VARCHAR(2000) NULL,
    ADD COLUMN identified_deficiencies VARCHAR(1000) NULL,
    ADD COLUMN recommended_food_sources VARCHAR(1500) NULL,
    ADD COLUMN reviewed_by_doctor BIT DEFAULT 0,
    ADD COLUMN doctor_review_notes VARCHAR(1000) NULL;

-- 6. Food Log Symptoms and Difficulty Reporting
ALTER TABLE food_logs
    ADD COLUMN difficulty_reason VARCHAR(255) NULL,
    ADD COLUMN difficulty_rating INT NULL,
    ADD COLUMN symptoms_reported VARCHAR(500) NULL;

-- 7. Seed Initial Medical Condition Food Restriction Database
INSERT INTO health_conditions (name, category, icd_code, description, dietary_restrictions, foods_to_avoid, recommended_foods, recommended_alternatives, clinical_guidelines, is_active, created_at, updated_at)
VALUES 
('PCOS / PCOD', 'Endocrine & Metabolic', 'E28.2', 
 'Polycystic Ovary Syndrome characterized by insulin resistance and hormonal imbalance.', 
 'Low Glycemic Index, Anti-inflammatory, High Fiber (>30g/day), Moderate Low Carb', 
 'Refined flours, sugary bakery items, high-fructose syrups, trans-fats, processed deli meats, full-fat dairy with added hormones', 
 'Spearmint tea, cinnamon, flaxseeds, chia seeds, leafy greens (spinach, kale), wild salmon, walnuts, avocados, berries', 
 'Quinoa instead of white rice; Almond milk instead of regular cow milk; Stevia/Cinnamon instead of table sugar', 
 'Review carbohydrate portions with dietitian; pair carbohydrates with healthy fats and protein to blunt insulin spikes.', 1, NOW(), NOW()),

('Type 2 Diabetes Mellitus', 'Endocrine & Metabolic', 'E11.9', 
 'Chronic disorder characterized by hyperglycemia, impaired insulin secretion and peripheral insulin resistance.', 
 'Strict Low Glycemic Load, High Soluble Fiber, Low Saturated Fat (<7% total kcal)', 
 'Simple table sugars, fruit juices, sodas, sweets, white bread, instant noodles, deep fried foods', 
 'Steel-cut oats, barley, fenugreek seeds (methi), bitter gourd (karela), lentils, beans, non-starchy vegetables, tofu', 
 'Cauliflower rice instead of polished rice; Zucchini noodles instead of semolina pasta; Chia seed pudding instead of sweetened custard', 
 'Maintain consistent meal timing. Postprandial glucose tracking required. AI recommendations must be vetted by physician.', 1, NOW(), NOW()),

('Hypertension', 'Cardiovascular', 'I10', 
 'Persistent high arterial blood pressure requiring sodium limitation and arterial endothelial support.', 
 'DASH Diet Pattern, Low Sodium (<1500 mg/day), High Potassium, Magnesium and Calcium', 
 'Pickles, papads, canned salted soups, processed cheeses, cured meats, MSG, salted potato chips, licorice', 
 'Bananas, sweet potatoes, beets, unsalted almonds, pomegranates, garlic, spinach, low-fat yogurt', 
 'Lemon juice and nutritional herbs (oregano, rosemary) instead of table salt; Baked sweet potato wedges instead of salted French fries', 
 'Monitor systolic/diastolic trends daily. Maintain adequate hydration without excessive single-load fluid retention.', 1, NOW(), NOW()),

('Hypothyroidism', 'Endocrine', 'E03.9', 
 'Underactive thyroid gland with reduced baseline metabolic rate and potential micronutrient deficiencies.', 
 'Iodine and Selenium Support, Anti-inflammatory, Gluten-moderated, Limit excessive raw goitrogens', 
 'Excess raw cruciferous vegetables (raw cabbage, raw kale in large quantities), soy isoflavone isolates, heavily processed foods', 
 'Brazil nuts (selenium), iodized sea salt (moderate), eggs, cooked broccoli, cooked spinach, pumpkin seeds, seaweed/nori', 
 'Cooked cruciferous vegetables instead of raw smoothies; Coconut aminos instead of high-sodium soy sauce', 
 'Allow 4 hours between thyroid medication (Levothyroxine) and high-calcium or high-iron food/supplements.', 1, NOW(), NOW()),

('Hyperlipidemia / Dyslipidemia', 'Cardiovascular', 'E78.5', 
 'Elevated serum total cholesterol, LDL-C, and triglycerides with cardiovascular disease risk.', 
 'Low Saturated Fat (<6% calories), Zero Trans Fats, High Viscous Soluble Fiber (>10g/day), Plant Sterols', 
 'Butter, palm oil, deep fried street foods, organ meats, full-fat cream, commercially baked pastries', 
 'Oat bran, psyllium husk, walnuts, ground flaxseeds, olive oil, edamame, fatty fish (mackerel, salmon), apples', 
 'Extra virgin olive oil instead of butter or ghee; Hummus instead of mayonnaise; Steamed fish instead of fried red meat', 
 'Correlate daily saturated fat tracking with quarterly lipid profiles. Recommend lifestyle modifications alongside statins.', 1, NOW(), NOW()),

('Celiac Disease / Gluten Sensitivity', 'Gastrointestinal', 'K90.0', 
 'Autoimmune enteropathy triggered by gluten consumption leading to villous atrophy.', 
 '100% Strict Gluten-Free diet (Zero wheat, barley, rye, triticale, or cross-contaminated oats)', 
 'Wheat bread, roti made from standard wheat atta, semolina (sooji), maida, beer, standard soy sauce, malt vinegar', 
 'Certified gluten-free oats, quinoa, brown rice, millet (ragi, jowar, bajra), amaranth, all fresh vegetables, nuts', 
 'Jowar/Bajra roti instead of wheat roti; Tamari instead of wheat-fermented soy sauce; Rice noodles instead of wheat noodles', 
 'Ensure zero cross-contamination in kitchen utensils. Check micronutrient status (Ferritin, Vitamin D, Zinc).', 1, NOW(), NOW());

-- 8. Seed Key Food Items for Nutrition Calculator & Meal Builder
INSERT INTO food_items (name, category, serving_size_g, serving_description, calories_per_100g, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, source, is_active, created_at, updated_at)
VALUES
('Almonds (Raw)', 'Nuts & Seeds', 28.0, '1 handful (approx 23 nuts)', 579.0, 21.2, 21.6, 49.9, 12.5, 4.4, 1.0, 'LOCAL', 1, NOW(), NOW()),
('Paneer (Indian Cottage Cheese)', 'Dairy & Protein', 100.0, '1 block (100g)', 265.0, 18.3, 3.4, 20.8, 0.0, 2.5, 22.0, 'LOCAL', 1, NOW(), NOW()),
('Whole Wheat Bread Slice', 'Bakery & Grains', 35.0, '1 slice (35g)', 247.0, 12.0, 41.0, 3.5, 6.0, 4.0, 400.0, 'LOCAL', 1, NOW(), NOW()),
('Butter (Salted)', 'Fats & Oils', 10.0, '1 pat / teaspoon (10g)', 717.0, 0.9, 0.1, 81.1, 0.0, 0.1, 643.0, 'LOCAL', 1, NOW(), NOW()),
('Tomato (Fresh Sliced)', 'Vegetables', 50.0, '1 medium tomato', 18.0, 0.9, 3.9, 0.2, 1.2, 2.6, 5.0, 'LOCAL', 1, NOW(), NOW()),
('Cucumber (Sliced)', 'Vegetables', 50.0, '1/2 medium cucumber', 15.0, 0.7, 3.6, 0.1, 0.5, 1.7, 2.0, 'LOCAL', 1, NOW(), NOW()),
('Cow Milk (Low Fat 1.5%)', 'Dairy', 240.0, '1 cup (240ml)', 47.0, 3.4, 4.8, 1.5, 0.0, 4.8, 44.0, 'LOCAL', 1, NOW(), NOW()),
('Rolled Oats', 'Cereals & Grains', 40.0, '1 serving (40g dry)', 389.0, 16.9, 66.3, 6.9, 10.6, 0.0, 2.0, 'LOCAL', 1, NOW(), NOW()),
('Apple (Fresh with Skin)', 'Fruits', 150.0, '1 medium apple (150g)', 52.0, 0.3, 13.8, 0.2, 2.4, 10.4, 1.0, 'LOCAL', 1, NOW(), NOW()),
('Chicken Breast (Skinless Grilled)', 'Poultry & Meat', 100.0, '1 piece (100g cooked)', 165.0, 31.0, 0.0, 3.6, 0.0, 0.0, 74.0, 'LOCAL', 1, NOW(), NOW()),
('Egg (Boiled Large)', 'Poultry & Eggs', 50.0, '1 large egg (50g)', 155.0, 12.6, 1.1, 10.6, 0.0, 1.1, 124.0, 'LOCAL', 1, NOW(), NOW()),
('Yellow Lentil Dal (Cooked)', 'Legumes & Pulses', 150.0, '1 bowl (150g)', 116.0, 9.0, 20.0, 0.4, 7.9, 1.8, 180.0, 'LOCAL', 1, NOW(), NOW()),
('Greek Yogurt (Plain Unsweetened)', 'Dairy', 150.0, '1 cup (150g)', 59.0, 10.0, 3.6, 0.4, 0.0, 3.2, 36.0, 'LOCAL', 1, NOW(), NOW()),
('Spinach (Fresh Raw)', 'Vegetables', 100.0, '2 cups raw leaves', 23.0, 2.9, 3.6, 0.4, 2.2, 0.4, 79.0, 'LOCAL', 1, NOW(), NOW()),
('Brown Rice (Cooked)', 'Cereals & Grains', 150.0, '1 bowl (150g cooked)', 111.0, 2.6, 23.0, 0.9, 1.8, 0.4, 5.0, 'LOCAL', 1, NOW(), NOW()),
('Olive Oil (Extra Virgin)', 'Fats & Oils', 15.0, '1 tablespoon (15ml)', 884.0, 0.0, 0.0, 100.0, 0.0, 0.0, 2.0, 'LOCAL', 1, NOW(), NOW()),
('Walnuts (Raw Halves)', 'Nuts & Seeds', 28.0, '1 handful (7-8 halves)', 654.0, 15.2, 13.7, 65.2, 6.7, 2.6, 2.0, 'LOCAL', 1, NOW(), NOW()),
('Chia Seeds', 'Nuts & Seeds', 15.0, '1 tablespoon (15g)', 486.0, 16.5, 42.1, 30.7, 34.4, 0.0, 16.0, 'LOCAL', 1, NOW(), NOW()),
('Banana (Fresh)', 'Fruits', 120.0, '1 medium banana (120g)', 89.0, 1.1, 22.8, 0.3, 2.6, 12.2, 1.0, 'LOCAL', 1, NOW(), NOW());
