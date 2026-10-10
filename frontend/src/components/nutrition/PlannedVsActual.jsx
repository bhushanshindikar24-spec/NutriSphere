
import { formatCalories } from "../../utils/formatters";
import Badge from "../common/Badge";

export default function PlannedVsActual({ comparison }) {
  if (!comparison) {
    return (
      <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        No planned vs actual comparison data available for this date.
      </div>
    );
  }

  const planned = comparison.plannedCalories || 2000;
  const actual = comparison.actualCalories || 0;
  const diff = actual - planned;
  const adherence = comparison.adherencePercentage || Math.max(0, 100 - Math.abs(Math.round((diff / planned) * 100)));

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>Planned vs Actual Caloric Intake</h4>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            Daily adherence comparison
          </span>
        </div>
        <Badge variant={adherence >= 80 ? "success" : "warning"}>
          {adherence}% Adherence
        </Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", textAlign: "center" }}>
        <div style={{ background: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Planned Target</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "1.25rem", color: "var(--secondary)" }}>
            {formatCalories(planned)}
          </p>
        </div>

        <div style={{ background: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Actual Logged</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "1.25rem", color: "var(--primary)" }}>
            {formatCalories(actual)}
          </p>
        </div>

        <div style={{ background: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Variance</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "1.25rem", color: Math.abs(diff) < 150 ? "#10B981" : "#EF4444" }}>
            {diff > 0 ? `+${Math.round(diff)}` : Math.round(diff)} kcal
          </p>
        </div>
      </div>
    </div>
  );
}
