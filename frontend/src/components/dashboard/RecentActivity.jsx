
import { formatTime } from "../../utils/dateUtils";
import { Clock } from "lucide-react";

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <h4 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>Recent Activity</h4>

      {activities.length === 0 ? (
        <p className="text-muted" style={{ fontSize: "0.875rem", margin: 0 }}>
          No recent activity logged for today.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {activities.map((act, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: i === activities.length - 1 ? "none" : "1px solid var(--border-color)",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: "0.875rem" }}>{act.title}</p>
                <span className="text-muted" style={{ fontSize: "0.75rem" }}>{act.description}</span>
              </div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={12} /> {formatTime(act.time)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
