
import { formatCalories } from "../../utils/formatters";

export default function CalorieBudgetBar({ consumed = 0, target = 2000 }) {
  const remaining = Math.max(0, target - consumed);
  const pct = Math.min(100, Math.round((consumed / target) * 100));
  const isOver = consumed > target;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
        <div>
          <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>{formatCalories(consumed)}</span>
          <span className="text-muted" style={{ fontSize: "0.875rem" }}> / {formatCalories(target)}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: isOver ? "#EF4444" : "var(--primary)" }}>
            {isOver ? `+${Math.round(consumed - target)} kcal over` : `${Math.round(remaining)} kcal left`}
          </span>
        </div>
      </div>

      <div style={{ height: "10px", background: "var(--border-color)", borderRadius: "5px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: isOver ? "#EF4444" : pct > 85 ? "#10B981" : "var(--primary)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
