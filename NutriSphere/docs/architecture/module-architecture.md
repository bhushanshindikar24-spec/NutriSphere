# NutriSphere — Modular Architecture

## Backend Modules (`com.nutrisphere`)

- `auth`: JWT token authentication, registration, refresh tokens, Spring Security integration.
- `user`: User accounts, credentials, activation status, role hierarchies.
- `doctor`: Doctor profile management, clinical assignments, consultation histories.
- `dietitian`: Dietitian profile management, clinical caseloads, requirement calculation.
- `patient`: Patient demographics, baseline measurements, biometric histories.
- `medical`:
  - `condition`: Health conditions, ICD taxonomy, patient clinical diagnoses.
  - `laboratory`: Diagnostic laboratory reports and quantitative biomarker values.
  - `consultation`: Clinical encounter notes and follow-up schedules.
- `nutrition`:
  - `dietplan`: Multi-day meal plans, meal items, target calories and macros.
  - `logging`: Patient food consumption, meal deviations, calorie aggregations.
  - `hydration`: Real-time water tracking and daily hydration volume.
  - `food`: Food database, USDA & Open Food Facts caching, nutrient tables.
  - `requirements`: Harris-Benedict & Mifflin-St Jeor requirement calculators.
- `intelligence`:
  - `reality`: 6-dimension plan feasibility scoring algorithm.
  - `adaptive`: Autonomous pattern analysis and dietary adjustment suggestions.
  - `adherence`: Barrier logging, category aggregation, root cause analysis.
  - `digitaltwin`: Biomarker simulation and 30-day projection modeling.
  - `homefood`: Pantry ingredient inventory and recipe constraint matcher.
- `hotel`:
  - `menu`: Culinary kitchen meal catalog with clinical allergen tags.
  - `order`: Room delivery order processing, line items, and status progression.
  - `category` & `availability`: Meal classification and kitchen availability windows.
- `notification`: In-app notification dispatcher with unread badge tracking.
- `file`: Multipart file upload and secure storage handling.
- `audit`: HIPAA-aligned immutable access and mutation logging.
