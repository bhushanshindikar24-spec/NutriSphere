
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { capitalize } from "../../utils/formatters";

export default function BarrierCard({ barrier, onResolve, onSelect }) {
  if (!barrier) return null;

  const severityColors = {
    HIGH: { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444", border: "rgba(239, 68, 68, 0.3)" },
    MEDIUM: { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" },
    LOW: { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981", border: "rgba(16, 185, 129, 0.3)" },
  };

  const severity = barrier.severity || "MEDIUM";
  const colors = severityColors[severity] || severityColors.MEDIUM;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.25rem",
        borderRadius: "var(--radius-md)",
        borderLeft: `4px solid ${colors.text}`,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        cursor: onSelect ? "pointer" : "default",
      }}
      onClick={() => onSelect && onSelect(barrier)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={18} color={colors.text} />
          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
            {capitalize(barrier.barrierType || barrier.type || "Barrier")}
          </h4>
        </div>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          {severity}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        {barrier.description || barrier.notes || "No details provided"}
      </p>

      {barrier.suggestedIntervention && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px dashed var(--border-color)",
            padding: "0.6rem 0.8rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
          }}
        >
          <strong style={{ color: "var(--primary)" }}>Suggested Action: </strong>
          {barrier.suggestedIntervention}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <Clock size={12} />
          {formatDate(barrier.createdAt || barrier.date || new Date())}
        </span>

        {barrier.resolved ? (
          <span style={{ color: "#10B981", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <CheckCircle2 size={13} /> Resolved
          </span>
        ) : onResolve ? (
          <button
            className="btn btn-sm btn-outline"
            style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
            onClick={(e) => {
              e.stopPropagation();
              onResolve(barrier.id);
            }}
          >
            Mark Resolved
          </button>
        ) : (
          <span style={{ color: "#F59E0B" }}>Active</span>
        )}
      </div>
    </div>
  );
}
