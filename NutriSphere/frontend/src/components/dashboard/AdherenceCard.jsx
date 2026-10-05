
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function AdherenceCard({ adherencePct = 0, loggedDays = 0, totalDays = 7 }) {
  const isGood = adherencePct >= 80;
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>Weekly Adherence</h4>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            {loggedDays} of {totalDays} days logged
          </span>
        </div>
        {isGood ? (
          <CheckCircle2 size={24} color="#10B981" />
        ) : (
          <AlertCircle size={24} color="#F59E0B" />
        )}
      </div>

      <div style={{ fontSize: "2rem", fontWeight: 800, color: isGood ? "#10B981" : "#F59E0B", marginBottom: "0.5rem" }}>
        {Math.round(adherencePct)}%
      </div>

      <div style={{ height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, adherencePct))}%`,
            background: isGood ? "#10B981" : "#F59E0B",
          }}
        />
      </div>
    </div>
  );
}
