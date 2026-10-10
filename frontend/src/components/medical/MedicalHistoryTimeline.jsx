
import { formatDate } from "../../utils/dateUtils";

export default function MedicalHistoryTimeline({ history = [] }) {
  if (history.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        No historical medical events recorded.
      </div>
    );
  }

  return (
    <div style={{ position: "relative", paddingLeft: "1.5rem", borderLeft: "2px solid var(--border-color)" }}>
      {history.map((h, i) => (
        <div key={h.id || i} style={{ marginBottom: "1.5rem", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "-1.95rem",
              top: "2px",
              background: "var(--primary)",
              color: "#fff",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "3px solid var(--bg-surface)",
            }}
          />
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {formatDate(h.diagnosisDate || h.createdAt)}
            </span>
            <h4 style={{ margin: "0.2rem 0", fontSize: "0.9375rem" }}>{h.conditionName}</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.8125rem", lineHeight: 1.4 }}>
              {h.notes || h.description || "Historical diagnosis recorded by physician."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
