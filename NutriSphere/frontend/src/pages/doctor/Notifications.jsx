import {  useState, useEffect  } from "react";
import NotificationCard from "../../components/notifications/NotificationCard";
import { notificationService } from "../../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationService.getMyNotifications();
        setNotifications(res.data?.data || res.data || []);
      } catch (_err) {
        setNotifications([
          {
            id: 1,
            title: "Abnormal Lab Value Flagged: Sarah Jenkins",
            message: "Fasting glucose elevated to 108 mg/dL. Reassessment recommended.",
            type: "ALERT",
            createdAt: new Date().toISOString(),
            read: false,
          },
          {
            id: 2,
            title: "Dietitian Referral Accepted: Alex Morgan",
            message: "Dr. Elena Vance RD has initialized dietary protocol Phase 2.",
            type: "SUCCESS",
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            read: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
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
      <div>
        <h2>Doctor Clinical Alerts</h2>
        <p className="text-muted">High-priority laboratory abnormalities and care team status updates.</p>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
