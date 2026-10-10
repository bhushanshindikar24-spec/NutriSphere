# NutriSphere — Intelligence & Behavioral APIs

## Endpoints

### 1. Reality Score Engine (`/api/reality-score`)
- **Calculate Score**: `POST /api/reality-score/calculate` (Parameters: `patientUserId`, `dietPlanId`)
- **Score History**: `GET /api/reality-score/history`
- **Output Sample**:
```json
{
  "overallScore": 95.0,
  "dimensionScores": {
    "Food Availability": 90.0,
    "Affordability": 95.0,
    "Cooking Complexity": 90.0,
    "Preference": 100.0,
    "Schedule": 95.0,
    "Historical Adherence": 100.0
  },
  "interpretation": "High Feasibility"
}
```

### 2. Adaptive Diet Engine (`/api/adaptive`)
- **Generate Recommendations**: `POST /api/adaptive/generate?patientUserId={id}&dietPlanId={id}`
- **Evaluate Patient**: `POST /api/adaptive/evaluate?patientId={id}`
- **Get Recommendations**: `GET /api/adaptive/recommendations?patientUserId={id}`
- **Approve Recommendation**: `PUT /api/adaptive/recommendations/{id}/approve`
- **Reject Recommendation**: `PUT /api/adaptive/recommendations/{id}/reject`

### 3. Nutrition Digital Twin (`/api/digital-twin`)
- **Get Current Twin**: `GET /api/digital-twin`
- **Get For Patient**: `GET /api/digital-twin/patient/{id}`
- **Recalculate Projections**: `POST /api/digital-twin/recalculate`

### 4. Home Food Mode (`/api/home-food`)
- **Get Inventory**: `GET /api/home-food/inventory`
- **Add Inventory Item**: `POST /api/home-food/inventory`
- **Remove Inventory Item**: `DELETE /api/home-food/inventory/{id}`
- **Get Suggestions**: `GET /api/home-food/suggestions`

### 5. Adherence Barrier Tracking (`/api/barriers`)
- **Record Barrier**: `POST /api/barriers`
- **Analyze Barriers**: `GET /api/barriers/analysis`
- **Resolve Barrier**: `PUT /api/barriers/{id}/resolve`
