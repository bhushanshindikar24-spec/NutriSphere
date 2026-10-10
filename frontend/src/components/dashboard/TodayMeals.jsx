
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

// eslint-disable-next-line unused-imports/no-unused-vars
export default function TodayMeals({ meals = [], onLogMeal }) {
  const mealSlots = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h4 style={{ margin: 0, fontSize: "1rem" }}>Today's Meal Schedule</h4>
        <Link to="/patient/log-food" className="btn btn-outline" style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}>
          <Plus size={14} /> Log Extra
        </Link>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {mealSlots.map((slot) => {
          const loggedForSlot = meals.filter((m) => m.mealType === slot);
          return (
            <div
              key={slot}
              style={{
                padding: "0.875rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-color)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--primary)" }}>
                  {slot}
                </span>
                <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {loggedForSlot.reduce((s, m) => s + (m.calories || 0), 0)} kcal
                </span>
              </div>

              {loggedForSlot.length === 0 ? (
                <p className="text-muted" style={{ margin: "0.25rem 0 0", fontSize: "0.75rem" }}>
                  Nothing logged yet
                </p>
              ) : (
                <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.25rem" }}>
                  {loggedForSlot.map((item, idx) => (
                    <div key={idx} style={{ fontSize: "0.8125rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{item.foodName}</span>
                      <span className="text-muted">{item.protein || 0}g protein</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
