
import NotificationItem from "./NotificationItem";
import { useNotifications } from "../../hooks/useNotifications";

export default function NotificationList() {
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();

  return (
    <div className="glass-panel" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.125rem" }}>Notifications</h3>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            You are all caught up! No notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
          ))
        )}
      </div>
    </div>
  );
}
