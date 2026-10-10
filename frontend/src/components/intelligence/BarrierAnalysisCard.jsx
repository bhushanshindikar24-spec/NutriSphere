
import { AlertTriangle } from "lucide-react";
import { capitalize } from "../../utils/formatters";

// eslint-disable-next-line unused-imports/no-unused-vars
export default function BarrierAnalysisCard({ barriers = [], barrierCounts = {} }) {
  const totalBarriers = Object.values(barrierCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", padding: "0.5rem", borderRadius: "8px" }}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>Adherence Barrier Analysis</h4>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            Total reported barriers: {totalBarriers}
          </span>
        </div>
      </div>

      {totalBarriers === 0 ? (
        <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          No adherence barriers reported recently. Excellent compliance!
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {Object.entries(barrierCounts).map(([type, count]) => {
            const pct = Math.round((count / totalBarriers) * 100);
            return (
              <div key={type}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                  <span>{capitalize(type)}</span>
                  <span style={{ fontWeight: 600 }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: pct > 40 ? "#EF4444" : pct > 20 ? "#F59E0B" : "var(--primary)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
