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
            title: "New Delivery Order Received: #ORD-9412",
            message: "Patient Alex Morgan ordered Mediterranean Herb Chicken Bowl & Salad.",
            type: "INFO",
            createdAt: new Date().toISOString(),
            read: false,
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
        <h2>Kitchen Order Alerts</h2>
        <p className="text-muted">Real-time alerts for incoming orders, preparation deadlines, and courier dispatch.</p>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
