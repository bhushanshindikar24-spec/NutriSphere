import {  useState, useEffect  } from "react";
import NotificationCard from "../../components/notifications/NotificationCard";
import { notificationService } from "../../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      setNotifications(res.data?.data || res.data || []);
    } catch (_err) {
      setNotifications([
        {
          id: 1,
          title: "Adherence Drop Alert: Robert Chen",
          message: "Weekly compliance dropped to 42%. Adaptive Engine has generated protocol adjustments.",
          type: "WARNING",
          createdAt: new Date().toISOString(),
          read: false,
        },
        {
          id: 2,
          title: "Meal Deviation Barrier Reported: Alex Morgan",
          message: "Reported: Food Unavailable (salmon) for dinner slot. Substitute recommended.",
          type: "INFO",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          read: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifs();
  }, []);

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n)));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) return <div className="loading-screen">Loading Notifications...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Clinical Alerts & Notifications</h2>
          <p className="text-muted">Real-time alerts regarding patient barriers, compliance drops, and adaptive suggestions.</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
