
import Badge from "../common/Badge";
import { AlertCircle, Trash2 } from "lucide-react";

export default function ConditionList({ conditions = [], onRemove, canEdit = false }) {
  if (conditions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        No medical conditions diagnosed or recorded.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {conditions.map((c) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.875rem 1rem",
            background: "var(--bg-color)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <AlertCircle size={18} color="var(--primary)" />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.875rem" }}>{c.conditionName}</p>
              {c.diagnosedDate && (
                <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Diagnosed: {c.diagnosedDate}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {c.severity && (
              <Badge variant={c.severity === "HIGH" ? "danger" : c.severity === "MODERATE" ? "warning" : "neutral"}>
                {c.severity}
              </Badge>
            )}
            {canEdit && onRemove && (
              <button
                onClick={() => onRemove(c.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#EF4444",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
