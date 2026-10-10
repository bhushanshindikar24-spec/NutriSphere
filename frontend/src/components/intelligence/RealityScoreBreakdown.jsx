import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function RealityScoreBreakdown({ breakdown = {}, score = 0 }) {
  const entries = Object.entries(breakdown || {}).filter(([, value]) => value != null);

  const getStatusIcon = (val) => {
    if (val >= 80) return <CheckCircle2 size={16} color="#10B981" />;
    if (val >= 50) return <AlertTriangle size={16} color="#F59E0B" />;
    return <XCircle size={16} color="#EF4444" />;
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "1.05rem" }}>Reality Score Dimension Breakdown</h4>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>Calculated feasibility dimensions</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>{score != null ? Math.round(score) : "N/A"}</span>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}> / 100</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted">No dimension scores are available yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {entries.map(([name, rawValue]) => {
            const val = Number(rawValue);
            return (
              <div key={name} style={{ border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {getStatusIcon(val)}
                    <strong style={{ fontSize: "0.9rem" }}>{name}</strong>
                  </div>
                  <strong style={{ fontSize: "0.95rem" }}>{Math.round(val)}%</strong>
                </div>
                <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, val))}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
