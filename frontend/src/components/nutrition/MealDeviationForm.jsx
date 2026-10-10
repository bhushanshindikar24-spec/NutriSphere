import {  useState  } from "react";
import { AlertTriangle } from "lucide-react";
import { BARRIER_TYPES } from "../../utils/constants";
import { capitalize } from "../../utils/formatters";

export default function MealDeviationForm({ onSubmit, onCancel, initialMeal = null }) {
  const [barrierType, setBarrierType] = useState("FOOD_UNAVAILABLE");
  const [actualFood, setActualFood] = useState("");
  const [notes, setNotes] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          barrierType,
          description: notes,
          actualMealEaten: actualFood,
          mealName: initialMeal?.mealName || initialMeal?.name || "Planned Meal",
          mealType: initialMeal?.mealType || "LUNCH",
          severity,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <AlertTriangle size={20} color="#F59E0B" />
        <h4 style={{ margin: 0 }}>Report Adherence Barrier & Deviation</h4>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            What prevented adherence?
          </label>
          <select
            className="input-field"
            value={barrierType}
            onChange={(e) => setBarrierType(e.target.value)}
            style={{ width: "100%" }}
          >
            {Object.keys(BARRIER_TYPES || {
              FOOD_UNAVAILABLE: "Food Unavailable",
              TIME_CONSTRAINT: "Time Constraint",
              SOCIAL_EVENT: "Social Event",
              FINANCIAL_CONSTRAINT: "Financial Constraint",
              DISLIKE_TASTE: "Dislike Food",
              HUNGER_CRAVINGS: "Hunger / Cravings",
              FATIGUE_STRESS: "Fatigue / Stress",
            }).map((key) => (
              <option key={key} value={key}>
                {capitalize(key)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            What did you eat instead? (Optional)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Quick sandwich and chips"
            value={actualFood}
            onChange={(e) => setActualFood(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Severity of Obstacle
          </label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {["LOW", "MEDIUM", "HIGH"].map((sev) => (
              <label key={sev} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.85rem" }}>
                <input
                  type="radio"
                  name="severity"
                  value={sev}
                  checked={severity === sev}
                  onChange={(e) => setSeverity(e.target.value)}
                />
                {sev}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Context & Details for Dietitian
          </label>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Describe what occurred (e.g. unexpected late meeting at office)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
          {onCancel && (
            <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Barrier Report"}
          </button>
        </div>
      </div>
    </form>
  );
}
