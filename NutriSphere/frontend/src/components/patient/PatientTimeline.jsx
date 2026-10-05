
import { formatDateTime } from "../../utils/dateUtils";

export default function PatientTimeline({ events = [] }) {
  if (events.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        No timeline events logged.
      </div>
    );
  }

  return (
    <div style={{ position: "relative", paddingLeft: "1.5rem", borderLeft: "2px solid var(--border-color)" }}>
      {events.map((ev, i) => (
        <div key={i} style={{ marginBottom: "1.5rem", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "-1.95rem",
              top: "2px",
              background: "var(--primary)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "3px solid var(--bg-surface)",
            }}
          />
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              {formatDateTime(ev.timestamp || ev.createdAt)}
            </span>
            <h4 style={{ margin: "0.2rem 0", fontSize: "0.9375rem" }}>{ev.title}</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.8125rem" }}>{ev.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
