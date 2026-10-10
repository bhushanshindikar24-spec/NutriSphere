
import { Info, AlertTriangle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function NotificationCard({ notification, onMarkRead, onDelete }) {
  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case "ALERT":
      case "WARNING":
        return <AlertTriangle size={18} color="#EF4444" />;
      case "SUCCESS":
        return <CheckCircle size={18} color="#10B981" />;
      case "REMINDER":
        return <Clock size={18} color="#F59E0B" />;
      default:
        return <Info size={18} color="var(--primary)" />;
    }
  };

  const isUnread = !notification.isRead && !notification.read;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        background: isUnread ? "rgba(99, 102, 241, 0.06)" : "var(--bg-surface)",
        borderLeft: isUnread ? "4px solid var(--primary)" : "4px solid transparent",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ marginTop: "2px" }}>
        {getIcon(notification.type)}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h4 style={{ margin: 0, fontSize: "0.925rem", fontWeight: isUnread ? 700 : 500 }}>
            {notification.title || "Notification"}
          </h4>
          <span className="text-muted" style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
            {formatDate(notification.createdAt || notification.date || new Date())}
          </span>
        </div>

        <p style={{ margin: "0.35rem 0 0.5rem 0", fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          {notification.message || notification.content}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          {isUnread && onMarkRead && (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => onMarkRead(notification.id)}
              style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
            >
              Mark Read
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(notification.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.2rem 0.4rem",
              }}
              title="Delete notification"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
