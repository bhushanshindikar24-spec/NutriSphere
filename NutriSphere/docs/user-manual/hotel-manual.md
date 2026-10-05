# NutriSphere — Culinary Hotel & Kitchen User Manual

## Welcome to the Culinary Kitchen Portal
The Culinary Portal links hospital nutrition services, wellness retreats, or affiliated hotel kitchens directly into the patient's care plan.

---

## 1. Dashboard Overview (`/hotel/dashboard`)
- **Active Orders Queue**: Live orders organized by preparation stage (`Pending`, `Preparing`, `Ready`, `Completed`).
- **Kitchen Availability**: Quick toggle switch to open or pause receiving orders.

## 2. Menu Management (`/hotel/menu`)
1. Click **Add Meal**.
2. Enter Item Name, Description, and Price ($).
3. Specify nutritional metadata: Total Calories (kcal), Protein (g), Carbohydrates (g), Fats (g).
4. Tag dietary attributes: Vegetarian, Vegan, Allergens (e.g. Gluten, Dairy, Peanuts).
5. Toggle item availability (`Available` vs `Sold Out`).

## 3. Order Processing & Fulfillment (`/hotel/orders`)
- Incoming orders appear with patient room number and special clinical instructions (e.g. "Low sodium dressing on side").
- Progress orders step-by-step:
  - `CONFIRMED`: Order accepted by kitchen.
  - `PREPARING`: Meal is cooking.
  - `READY`: Packed for room service dispatch.
  - `COMPLETED`: Delivered to patient.
- Updating status sends a notification directly to the patient's portal.
