
import { Activity } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import Badge from "../common/Badge";

export default function ConditionCard({ condition, onEdit, onDelete }) {
  if (!condition) return null;

  const severityVariant = {
    MILD: "info",
    MODERATE: "warning",
    SEVERE: "danger",
    CHRONIC: "danger",
    RESOLVED: "success",
  }[condition.severity || condition.status] || "neutral";

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", padding: "0.5rem", borderRadius: "8px" }}>
            <Activity size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>{condition.conditionName || condition.name}</h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              {condition.icdCode ? `ICD: ${condition.icdCode} • ` : ""}
              Diagnosed: {formatDate(condition.diagnosedDate || condition.createdAt)}
            </span>
          </div>
        </div>
        <Badge variant={severityVariant}>
          {condition.status || condition.severity || "ACTIVE"}
        </Badge>
      </div>

      {condition.notes && (
        <p className="text-muted" style={{ fontSize: "0.85rem", margin: "0.75rem 0", lineHeight: 1.4 }}>
          {condition.notes}
        </p>
      )}

      {condition.dietaryRestrictions && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            fontSize: "0.78rem",
            marginTop: "0.5rem",
          }}
        >
          <strong style={{ color: "#F59E0B" }}>Dietary Impact: </strong>
          {condition.dietaryRestrictions}
        </div>
      )}

      {(onEdit || onDelete) && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.75rem" }}>
          {onEdit && (
            <button className="btn btn-sm btn-outline" onClick={() => onEdit(condition)} style={{ fontSize: "0.75rem" }}>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => onDelete(condition.id)}
              style={{ fontSize: "0.75rem", color: "#EF4444" }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
