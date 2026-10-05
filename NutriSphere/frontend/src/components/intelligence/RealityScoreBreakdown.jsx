
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function RealityScoreBreakdown({ breakdown = {}, score = 0 }) {
  const dimensions = [
    {
      key: "caloricFeasibility",
      name: "Caloric Feasibility",
      desc: "Feasibility of planned deficit/surplus vs patient BMR and historical compliance",
      weight: 30,
    },
    {
      key: "mealTimingFeasibility",
      name: "Meal Timing & Schedule",
      desc: "Alignment with patient work schedule and reported lifestyle barriers",
      weight: 25,
    },
    {
      key: "foodAvailability",
      name: "Food Availability & Access",
      desc: "Access to planned ingredients via home pantry or partner kitchens",
      weight: 25,
    },
    {
      key: "biologicalTolerance",
      name: "Biological & Clinical Tolerance",
      desc: "Compatibility with laboratory markers, allergies, and diagnosed conditions",
      weight: 20,
    },
  ];

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
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
            Weighted algorithmic feasibility index
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444" }}>
            {Math.round(score)}
          </span>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}> / 100</span>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {dimensions.map((dim) => {
          const val = breakdown[dim.key] != null ? breakdown[dim.key] : (breakdown[dim.name] != null ? breakdown[dim.name] : 85);
          return (
            <div
              key={dim.key}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-color)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {getStatusIcon(val)}
                  <strong style={{ fontSize: "0.9rem" }}>{dim.name}</strong>
                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>({dim.weight}% weight)</span>
                </div>
                <strong style={{ fontSize: "0.95rem" }}>{Math.round(val)}%</strong>
              </div>

              <p className="text-muted" style={{ margin: "0 0 0.5rem 0", fontSize: "0.78rem" }}>
                {dim.desc}
              </p>

              <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, Math.max(0, val))}%`,
                    background: val >= 80 ? "#10B981" : val >= 50 ? "#F59E0B" : "#EF4444",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
