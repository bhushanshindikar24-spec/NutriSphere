
import { formatDateTime } from "../../utils/dateUtils";
import { Check, AlertTriangle, Calendar, FileText } from "lucide-react";

export default function NotificationItem({ notification, onMarkRead }) {
  const getIcon = () => {
    switch (notification.type) {
      case "DIET_PLAN_APPROVED":
      case "ASSIGNMENT":
        return <Check size={18} color="#10B981" />;
      case "ADHERENCE_ALERT":
      case "BARRIER_ANALYSIS":
        return <AlertTriangle size={18} color="#F59E0B" />;
      case "CONSULTATION":
        return <Calendar size={18} color="#3B82F6" />;
      default:
        return <FileText size={18} color="var(--primary)" />;
    }
  };

  return (
    <div
      style={{
        padding: "1rem",
        borderBottom: "1px solid var(--border-color)",
        background: notification.read ? "transparent" : "var(--primary-light)",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        transition: "var(--transition)",
      }}
    >
      <div style={{ marginTop: "0.25rem" }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ fontSize: "0.9375rem", margin: 0, fontWeight: notification.read ? 500 : 700 }}>
            {notification.title}
          </h4>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            {formatDateTime(notification.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
          {notification.message}
        </p>
      </div>
      {!notification.read && (
        <button
          onClick={() => onMarkRead(notification.id)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--primary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
          }}
        >
          Mark read
        </button>
      )}
    </div>
  );
}
