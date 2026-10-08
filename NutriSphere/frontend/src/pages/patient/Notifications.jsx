import { useEffect, useState } from "react";
import NotificationCard from "../../components/notifications/NotificationCard";
import { notificationService } from "../../services/notificationService";
import { Bell, CheckCheck } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const res = await notificationService.getMyNotifications();
        const data = res.data?.data || res.data || [];
        if (!cancelled) {
          setNotifications(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (_err) {
        if (!cancelled) {
          setNotifications([]);
          setError("Unable to load notifications. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadNotifications();
    return () => { cancelled = true; };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
    } catch (_err) {
      setError("Unable to mark the notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
    } catch (_err) {
      setError("Unable to mark notifications as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (_err) {
      setError("Unable to delete the notification.");
    }
  };

  if (loading) return <div className="loading-screen">Loading Notifications...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Patient Notifications</h2>
          <p className="text-muted">Stay informed about plan approvals, reminders, and care-team updates.</p>
        </div>
        {notifications.length > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error" role="alert">{error}</div>
      )}

      {notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
          <Bell size={40} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
          <p style={{ margin: 0 }}>No notifications are available.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
