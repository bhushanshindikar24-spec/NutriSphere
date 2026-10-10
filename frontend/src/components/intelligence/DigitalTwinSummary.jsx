
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

export default function DigitalTwinSummary({ twinData }) {
  if (!twinData) {
    return (
      <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
        <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>Digital Twin data pending initialization</p>
      </div>
    );
  }

  const {
    currentWeightKg,
    targetWeightKg,
    projectedWeight30Days,
    dailyCaloricTarget,
    realityScore,
    bmr,
    tdee,
  } = twinData;

  const isLosing = projectedWeight30Days < currentWeightKg;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={18} color="var(--primary)" />
          <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Digital Twin Snapshot</h4>
        </div>
        {realityScore != null && (
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "var(--primary)",
            }}
          >
            Score: {Math.round(realityScore)}%
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Weight Goal</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginTop: "0.25rem" }}>
            <strong style={{ fontSize: "1.1rem" }}>{currentWeightKg || "--"}</strong>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>/ {targetWeightKg || "--"} kg</span>
          </div>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>30-Day Forecast</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.25rem" }}>
            <strong style={{ fontSize: "1.1rem" }}>{projectedWeight30Days ? Math.round(projectedWeight30Days * 10) / 10 : "--"}</strong>
            <span style={{ fontSize: "0.75rem", color: isLosing ? "#10B981" : "#F59E0B" }}>
              {isLosing ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            </span>
          </div>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Target Intake</span>
          <strong style={{ fontSize: "1.1rem", display: "block", marginTop: "0.25rem" }}>
            {dailyCaloricTarget ? `${Math.round(dailyCaloricTarget)} kcal` : "--"}
          </strong>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>BMR / TDEE</span>
          <strong style={{ fontSize: "0.95rem", display: "block", marginTop: "0.25rem" }}>
            {bmr ? Math.round(bmr) : "--"} / {tdee ? Math.round(tdee) : "--"}
          </strong>
        </div>
      </div>
    </div>
  );
}
