# NutriSphere — Hotel & Culinary Kitchen API

## Overview
Connects clinical nutrition plans to physical culinary preparation. Patients can order clinically tailored meals from affiliated hospital or wellness hotel kitchens.

---

## Endpoints

### 1. Browse Public Hotel Meals
- **Endpoint**: `GET /api/hotel/meals/public`
- **Access**: Authenticated (Patient, Dietitian, Doctor)
- **Response**: Array of available meals with calories, macronutrients, allergens, and pricing.

### 2. Add Hotel Meal (Hotel Manager)
- **Endpoint**: `POST /api/hotel/meals`
- **Access**: `ROLE_HOTEL`
- **Request Body**:
```json
{
  "name": "Grilled Salmon Bowl",
  "description": "Wild salmon with brown rice, steamed broccoli, and avocado",
  "price": 14.50,
  "calories": 520.0,
  "proteinG": 42.0,
  "carbsG": 45.0,
  "fatG": 18.0,
  "vegetarian": false,
  "vegan": false,
  "available": true
}
```

### 3. Place Hotel Order (Patient)
- **Endpoint**: `POST /api/orders`
- **Access**: `ROLE_PATIENT`
- **Request Body**:
```json
{
  "hotelUserId": 4,
  "deliveryAddress": "Room 302, Building A",
  "specialInstructions": "Low sodium dressing on side",
  "items": [
    { "mealId": 1, "quantity": 2 }
  ]
}
```

### 4. Update Order Status (Hotel Kitchen)
- **Endpoint**: `PATCH /api/orders/{id}/status`
- **Access**: `ROLE_HOTEL`
- **Allowed Statuses**: `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`
- **Request Body**:
```json
{
  "status": "COMPLETED",
  "notes": "Delivered to room"
}
```
