
import { formatGrams } from "../../utils/formatters";

export default function MacroBreakdown({
  carbs = 0,
  carbsTarget = 250,
  protein = 0,
  proteinTarget = 100,
  fat = 0,
  fatTarget = 65,
}) {
  const macros = [
    { name: "Carbs", actual: carbs, target: carbsTarget, color: "#3B82F6" },
    { name: "Protein", actual: protein, target: proteinTarget, color: "#10B981" },
    { name: "Fat", actual: fat, target: fatTarget, color: "#F59E0B" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
      {macros.map((m) => {
        const pct = Math.min(100, Math.round((m.actual / (m.target || 1)) * 100));
        return (
          <div
            key={m.name}
            style={{
              padding: "1rem",
              background: "var(--bg-color)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 600 }}>{m.name}</span>
              <span className="text-muted">{pct}%</span>
            </div>
            <div style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              {formatGrams(m.actual)} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/ {m.target}g</span>
            </div>
            <div style={{ height: "4px", background: "var(--border-color)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: m.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
