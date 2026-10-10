import {  useState, useRef, useEffect  } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationItem from "./NotificationItem";

export default function NotificationBell() {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          color: "var(--text-main)",
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              background: "#EF4444",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 700,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: "360px",
            maxHeight: "450px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "var(--shadow-lg)",
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-surface)",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div>
            {notifications.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
