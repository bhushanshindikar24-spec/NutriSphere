# NutriSphere — Test Case Specification

| TC-ID | Title | Preconditions | Steps | Expected Result | Status |
|---|---|---|---|---|---|
| **TC-01** | Patient Login | Patient seeded in DB | Submit `patient@nutrisphere.com` / `password` | Returns JWT and role `PATIENT` | PASS |
| **TC-02** | Dietitian Login | Dietitian seeded | Submit `dietitian@nutrisphere.com` / `password` | Returns JWT and role `DIETITIAN` | PASS |
| **TC-03** | Doctor Login | Doctor seeded | Submit `doctor@nutrisphere.com` / `password` | Returns JWT and role `DOCTOR` | PASS |
| **TC-04** | Hotel Login | Hotel seeded | Submit `hotel@nutrisphere.com` / `password` | Returns JWT and role `HOTEL` | PASS |
| **TC-05** | Calculate Reality Score | Authenticated as Patient | Call `POST /api/reality-score/calculate` | Score returned with 6 dimensions | PASS |
| **TC-06** | Log Pantry Item | Authenticated as Patient | Post `{"foodName":"Oats","quantityG":500}` | Item added to inventory | PASS |
| **TC-07** | Query Home Food Suggestions | Pantry has items | Call `GET /api/home-food/suggestions` | Returns matching recipes | PASS |
| **TC-08** | Record Barrier | Authenticated as Patient | Post `{"barrierType":"TIME_CONSTRAINT"}` | Barrier saved and counted | PASS |
| **TC-09** | Trigger Adaptive Engine | 7 days low hydration | Call `POST /api/adaptive/evaluate?patientId=3` | Ticket generated as `PENDING_REVIEW` | PASS |
| **TC-10** | Dietitian Approve Rec | Pending rec exists | Call `PUT /api/adaptive/recommendations/1/approve` | Status transitions to `APPROVED` | PASS |
| **TC-11** | Create Hotel Meal | Authenticated as Hotel | Post meal details | Meal created with ID and price | PASS |
| **TC-12** | Place Hotel Order | Authenticated as Patient | Post order with meal ID | Order placed in `PENDING` status | PASS |
| **TC-13** | Complete Hotel Order | Authenticated as Hotel | Patch status to `COMPLETED` | Order marked `COMPLETED` | PASS |
| **TC-14** | Add Clinical Condition | Authenticated as Doctor | Post condition to patient ID | Condition saved with severity | PASS |
