
import { History } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function MedicalHistoryCard({ item, onEdit, onDelete }) {
  if (!item) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: "0.5rem", borderRadius: "8px" }}>
            <History size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{item.eventTitle || item.conditionName || item.title || "Historical Record"}</h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              {item.category ? `${item.category} • ` : ""}
              {formatDate(item.eventDate || item.date || item.createdAt)}
            </span>
          </div>
        </div>
        {item.severity && (
          <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>
            {item.severity}
          </span>
        )}
      </div>

      <p className="text-muted" style={{ fontSize: "0.85rem", margin: "0.5rem 0", lineHeight: 1.4 }}>
        {item.description || item.notes || "No details provided"}
      </p>

      {item.doctorNotes && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            fontSize: "0.78rem",
            marginTop: "0.5rem",
          }}
        >
          <strong style={{ color: "var(--primary)" }}>Clinician Note: </strong>
          {item.doctorNotes}
        </div>
      )}

      {(onEdit || onDelete) && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.75rem" }}>
          {onEdit && (
            <button className="btn btn-sm btn-outline" onClick={() => onEdit(item)} style={{ fontSize: "0.75rem" }}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn btn-sm btn-outline" onClick={() => onDelete(item.id)} style={{ fontSize: "0.75rem", color: "#EF4444" }}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
