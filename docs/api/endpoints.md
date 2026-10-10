# NutriSphere — Master API Endpoints Directory

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `GET` | `/api/health` | Public | Application health & status |
| `GET` | `/api/nutrition/diet-plans/my` | PATIENT | Get active patient diet plans |
| `GET` | `/api/nutrition/diet-plans/patient/{id}` | DIETITIAN, DOCTOR | Get plans for specific patient |
| `POST` | `/api/nutrition/diet-plans` | DIETITIAN | Create new clinical diet plan |
| `POST` | `/api/nutrition/diet-plans/{id}/approve` | DIETITIAN | Clinically approve a diet plan |
| `POST` | `/api/food-logs` | PATIENT, DIETITIAN | Log food intake meal item |
| `GET` | `/api/food-logs/today` | PATIENT, DIETITIAN | Get today's logged meals & totals |
| `POST` | `/api/water-logs` | PATIENT, DIETITIAN | Log water consumption in ml |
| `GET` | `/api/water-logs/today` | PATIENT, DIETITIAN | Get today's total water intake |
| `POST` | `/api/reality-score/calculate` | PATIENT, DIETITIAN | Compute 6-dimension Reality Score |
| `GET` | `/api/reality-score/history` | PATIENT, DIETITIAN | Get past reality score progression |
| `GET` | `/api/digital-twin` | PATIENT, DIETITIAN, DOCTOR | Get Nutrition Digital Twin projections |
| `POST` | `/api/digital-twin/recalculate` | PATIENT, DIETITIAN | Trigger real-time projection recalculation |
| `GET` | `/api/home-food/inventory` | PATIENT | Get pantry food items on hand |
| `POST` | `/api/home-food/inventory` | PATIENT | Add item to pantry inventory |
| `GET` | `/api/home-food/suggestions` | PATIENT | Get recipe suggestions from inventory |
| `POST` | `/api/barriers` | PATIENT, DIETITIAN | Record adherence barrier |
| `GET` | `/api/barriers/analysis` | PATIENT, DIETITIAN | Get barrier frequencies & dominant type |
| `POST` | `/api/adaptive/generate` | DIETITIAN | Generate adaptive diet suggestions |
| `PUT` | `/api/adaptive/recommendations/{id}/approve` | DIETITIAN | Approve adaptive diet change |
| `GET` | `/api/hotel/meals/public` | Authenticated | Browse available culinary kitchen meals |
| `POST` | `/api/hotel/meals` | HOTEL | Add new meal to hotel menu |
| `POST` | `/api/orders` | PATIENT | Place hotel meal room delivery order |
| `GET` | `/api/orders/my` | PATIENT | View patient order history |
| `PATCH`| `/api/orders/{id}/status` | HOTEL | Update order status (CONFIRMED..COMPLETED)|
| `GET` | `/api/medical/conditions/patient/{id}` | DOCTOR, DIETITIAN | View patient clinical diagnoses |
| `POST` | `/api/medical/conditions/patient` | DOCTOR | Register diagnosis to patient record |
| `GET` | `/api/medical/laboratory/patient/{id}` | DOCTOR, DIETITIAN | Get patient lab reports & blood values |
