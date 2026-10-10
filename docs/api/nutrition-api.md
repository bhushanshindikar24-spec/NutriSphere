# NutriSphere — Nutrition & Dietary Logging API

## Endpoints

### 1. Diet Plans (`/api/nutrition/diet-plans`)
- **My Plans (Patient)**: `GET /api/nutrition/diet-plans/my`
- **Patient Plans (Dietitian)**: `GET /api/nutrition/diet-plans/patient/{id}`
- **Create Plan**: `POST /api/nutrition/diet-plans`
- **Approve Plan**: `POST /api/nutrition/diet-plans/{id}/approve`
- **Add Meal to Plan**: `POST /api/nutrition/diet-plans/{id}/meals`

### 2. Food Logging (`/api/food-logs`)
- **Log Food Item**: `POST /api/food-logs`
  - Body: `{ foodItemId, foodName, mealType, quantityG, calories, proteinG, carbsG, fatG, logDate }`
- **Today's Logs**: `GET /api/food-logs/today`
- **Date Range Logs**: `GET /api/food-logs?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Delete Log**: `DELETE /api/food-logs/{id}`

### 3. Hydration Logging (`/api/water-logs`)
- **Log Water**: `POST /api/water-logs`
  - Body: `{ amountMl: 250, logDate: "2026-10-04" }`
- **Today's Total**: `GET /api/water-logs/today`
- **Date Range**: `GET /api/water-logs?from=YYYY-MM-DD&to=YYYY-MM-DD`

### 4. Nutritional Requirements (`/api/nutrition/requirements`)
- **Calculate Requirements**: `POST /api/nutrition/requirements/calculate`
  - Computes BMR, TDEE, Caloric Target, Macronutrient Grams (Protein, Carbs, Fats, Fiber) based on age, gender, height, weight, activity level, and clinical goal.
