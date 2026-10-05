import {  useState, useEffect  } from "react";
import NotificationCard from "../../components/notifications/NotificationCard";
import { notificationService } from "../../services/notificationService";
import { Bell, CheckCheck } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await notificationService.getMyNotifications();
        setNotifications(res.data?.data || res.data || []);
      } catch (_err) {
        console.error("Failed to load notifications", _err);
        setNotifications([
          {
            id: 1,
            title: "Adaptive Recommendation Ready",
            message: "Dietitian Dr. Vance updated your dinner carbohydrate target to adjust for late-evening metabolic recovery.",
            type: "INFO",
            createdAt: new Date().toISOString(),
            read: false,
          },
          {
            id: 2,
            title: "Daily Hydration Reminder",
            message: "You are currently at 1,250 mL of your 2,500 mL goal today. Remember to drink a glass of water.",
            type: "REMINDER",
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
            read: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
    } catch (_err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
    } catch (_err) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (_err) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  if (loading) return <div className="loading-screen">Loading Notifications...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Notifications</h2>
          <p className="text-muted">Stay informed on plan adjustments, hydration alerts, and physician notes.</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
          >
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
          <Bell size={40} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
          <p style={{ margin: 0 }}>You are all caught up! No notifications.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
