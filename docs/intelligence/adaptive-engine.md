# NutriSphere — Adaptive Diet Engine Specification

## Purpose
The Adaptive Diet Engine continuously monitors patient behavioral logs and identifies opportunities to adapt the dietary prescription before non-compliance leads to clinical abandonment.

---

## Detection Triggers

1. **Protein Deficit Trigger**:
   - **Condition**: 7-day average protein intake $< 70\%$ of plan target (`targetProteinG`).
   - **Recommendation Generated**: `PROTEIN_DEFICIT` with suggested high-protein snacks or meal additions.

2. **Hydration Deficit Trigger**:
   - **Condition**: 7-day average water consumption $< 1500\text{ ml/day}$.
   - **Recommendation Generated**: `LOW_HYDRATION` suggesting hydration timing reminders.

3. **Recurrent Barrier Trigger**:
   - **Condition**: $\ge 3$ barrier occurrences logged in a rolling 7-day window.
   - **Recommendation Generated**: `BARRIER_PATTERN` identifying the dominant barrier.

---

## Workflow & State Machine
```
[ Trigger Detected ] ──► Status: PENDING_REVIEW ──► Dietitian Notification
                                │
                                ├──► [ Dietitian Approves ] ──► Status: APPROVED ──► Update Patient Plan
                                └──► [ Dietitian Rejects ]  ──► Status: REJECTED  ──► Dismiss Ticket
```
All state transitions are logged with reviewer user ID, timestamp, and clinical review notes.
