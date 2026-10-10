# NutriSphere — Integration Testing Framework & Results

## Integration Scope
Integration testing validates the interplay between controllers, service transactions, JPA persistence, Flyway migrations, and frontend Axios clients.

---

## Executed Integration Test Suites

1. **Authentication & Authorization Pipeline**:
   - Tested JWT generation, claims extraction, Bearer filter interception, and method-level role checking.
   - Result: All 4 persona logins (`doctor@`, `dietitian@`, `patient@`, `hotel@`) verified with role tokens.

2. **Dietary Intelligence Loop**:
   - Patient logs food and water -> Reality Score engine recalculates dynamically -> Adaptive Engine triggers ticket on low hydration.
   - Result: Verified live with test payloads (`95.0 High Feasibility`, `Low Hydration Pattern` generated).

3. **Culinary Order Lifecycle**:
   - Hotel creates meal (`Grilled Salmon Bowl`, $14.50) -> Patient browses public menu -> Patient orders 2 units -> Hotel updates status to `COMPLETED`.
   - Result: Verified live; total order amount ($29.00) accurately persisted and updated.

4. **Clinical Record Management**:
   - Doctor diagnoses `Mild Hypertension` (MILD) -> Record persisted in `patient_conditions` -> Accessible to assigned Dietitian.
   - Result: Verified live with 200 OK responses.
