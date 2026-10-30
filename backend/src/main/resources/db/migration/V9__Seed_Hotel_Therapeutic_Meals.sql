-- V9__Seed_Hotel_Therapeutic_Meals.sql
-- Seed Culinary Hotel User, Hotel Profile, Categories and 10 Authentic Indian Therapeutic Meals

INSERT INTO users (
    email, password_hash, first_name, last_name, phone_number, role, status, email_verified, created_at, updated_at
) VALUES (
    'kitchen.bkc@nutrisphere.com',
    '$2a$12$kJ2uH1O9sIa6opPEfC8gbuwckz1NfPj5qRA8DLg9CUvp83Sn9VPa6',
    'NutriSphere',
    'Central Kitchen',
    '+91 22 6123 4567',
    'HOTEL',
    'ACTIVE',
    1,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE updated_at = NOW();

SET @hotel_user_id = (SELECT id FROM users WHERE email = 'kitchen.bkc@nutrisphere.com' LIMIT 1);

INSERT INTO hotel_profiles (
    user_id, hotel_name, hotel_address, phone_number, description, cuisine_type, is_active, license_number, verification_status, created_at, updated_at
) VALUES (
    @hotel_user_id,
    'NutriSphere Central Culinary Kitchen BKC',
    'Plot C-59, G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    '+91 22 6123 4567',
    'FSSAI-certified clinical cloud kitchen preparing low-GI, renal-safe, high-protein, and cardiac-tailored Indian therapeutic meals formulated with A2 cow ghee and cold-pressed oils.',
    'Authentic Indian Therapeutic & Clinical Dining',
    1,
    'FSSAI-LIC-11524999000123',
    'APPROVED',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Categories: 1=BREAKFAST, 2=LUNCH, 3=DINNER, 4=SNACK
INSERT INTO hotel_categories (id, hotel_user_id, name, description, sort_order, is_active, created_at, updated_at)
VALUES
(1, @hotel_user_id, 'BREAKFAST', 'Nutrient-dense Indian morning meals, low-GI whole grains and digestive starters', 1, 1, NOW(), NOW()),
(2, @hotel_user_id, 'LUNCH', 'Balanced Indian thalis, multigrain rotis, dal tadka, and seasonal clinical subzis', 2, 1, NOW(), NOW()),
(3, @hotel_user_id, 'DINNER', 'Light, restorative recovery dinners, moong dal khichdi, and grilled tandoori preparations', 3, 1, NOW(), NOW()),
(4, @hotel_user_id, 'SNACK', 'Clean protein evening snacks, roasted makhanas, sprouted chaats, and golden turmeric elixirs', 4, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 10 Authentic Indian Therapeutic Meals
INSERT INTO hotel_meals (
    hotel_user_id, category_id, name, description, price, calories, protein_g, carbs_g, fat_g, allergens, is_vegetarian, is_vegan, preparation_time_min, image_url, is_available, created_at, updated_at
) VALUES
(
    @hotel_user_id, 2,
    'Paneer Tikka & Multigrain Phulka Thali',
    'Char-grilled spiced low-fat paneer, 2 multigrain phulkas (wheat + chana + oats), yellow dal tadka, cucumber-tomato kachumber, and mint dip.',
    220.0, 480.0, 26.0, 52.0, 14.0, 'Dairy, Gluten', 1, 0, 25,
    '/images/meals/paneer-tikka.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 3,
    'Moong Dal Khichdi with A2 Desi Ghee & Dahi',
    'Comforting slow-cooked yellow moong dal with aged rice, mild cumin tempering in A2 desi ghee, served with chilled probiotic curd and roasted papad.',
    160.0, 380.0, 16.0, 58.0, 8.0, 'Dairy', 1, 0, 20,
    '/images/meals/moong-dal-khichdi.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 1,
    'Vegetable Poha with Roasted Peanuts & Lemon',
    'Flattened rice sautéed with curry leaves, mustard seeds, green peas, carrots, crunchy roasted peanuts, and fresh vitamin-C lemon.',
    120.0, 340.0, 10.0, 54.0, 9.0, 'Peanuts', 1, 1, 15,
    '/images/meals/vegetable-poha.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 3,
    'Tandoori Chicken Tikka with Brown Rice & Chaas',
    'Tender skinless tandoori chicken breast marinated in hung curd and roasted ground spices, served with brown basmati rice and spiced mint chaas.',
    260.0, 510.0, 42.0, 38.0, 12.0, 'Dairy', 0, 0, 30,
    '/images/meals/tandoori-chicken.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 2,
    'Palak Paneer with Jowar Bhakri & Spiced Salad',
    'Iron-dense fresh spinach puree with cottage cheese cubes, paired with 2 traditional gluten-free jowar bhakris and sendha namak kachumber.',
    210.0, 440.0, 22.0, 46.0, 16.0, 'Dairy', 1, 0, 25,
    '/images/meals/palak-paneer.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 1,
    'Steamed Idli (3 pcs) with Drumstick Sambar',
    'Fermented steamed rice-lentil idlis served with vegetable-rich drumstick sambar (toor dal, tomatoes, curry leaves) and fresh coconut chutney.',
    110.0, 290.0, 11.0, 56.0, 3.0, 'Tree Nuts (Coconut)', 1, 1, 15,
    '/images/meals/steamed-idli.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 1,
    'Methi Thepla with Spiced Curd & Moong Dal',
    'Fresh fenugreek leaves kneaded with whole wheat and besan flour with ajwain seeds, served with yellow moong dal and low-fat curd.',
    150.0, 360.0, 15.0, 48.0, 10.0, 'Dairy, Gluten', 1, 0, 20,
    '/images/meals/methi-thepla.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 4,
    'Roasted Makhana & Sprouted Kala Chana Chaat',
    'Fox nuts slow-roasted in A2 cow ghee with rock salt, combined with steamed sprouted black chickpeas, chopped tomatoes, and green chilies.',
    130.0, 250.0, 14.0, 36.0, 5.0, 'Dairy (Ghee)', 1, 0, 15,
    '/images/meals/sprouts-chaat.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 2,
    'Lauki Chana Dal with Jowar Roti & Tadka Chaas',
    'Tender bottle gourd simmered with bengal gram in Sendha namak and cumin tempering, served with 2 jowar rotis and roasted jeera buttermilk.',
    180.0, 390.0, 18.0, 54.0, 9.0, 'Dairy', 1, 0, 25,
    '/images/meals/lauki-chana-dal.jpg', 1, NOW(), NOW()
),
(
    @hotel_user_id, 4,
    'Golden Haldi Doodh & Roasted Akhrot',
    'Boiled A2 cow milk infused with organic Salem turmeric, black pepper for maximum curcumin absorption, and 2 halves of Kashmiri walnuts.',
    90.0, 180.0, 8.0, 14.0, 9.0, 'Dairy, Tree Nuts (Walnuts)', 1, 0, 10,
    '/images/meals/golden-haldi-doodh.jpg', 1, NOW(), NOW()
);
