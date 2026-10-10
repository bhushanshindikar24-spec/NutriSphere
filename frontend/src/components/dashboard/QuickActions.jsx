
import { Link } from "react-router-dom";
import { Apple, Droplets, Utensils, AlertTriangle } from "lucide-react";

export default function QuickActions({ actions = [] }) {
  const defaultActions = [
    { label: "Log Meal", path: "/patient/log-food", icon: <Apple size={18} color="var(--primary)" /> },
    { label: "Track Water", path: "/patient/water", icon: <Droplets size={18} color="#3B82F6" /> },
    { label: "Home Pantry", path: "/patient/home-food", icon: <Utensils size={18} color="#EC4899" /> },
    { label: "Report Barrier", path: "/patient/barrier", icon: <AlertTriangle size={18} color="#F59E0B" /> },
  ];

  const items = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <h4 style={{ margin: "0 0 1rem", fontSize: "0.9375rem" }}>Quick Actions</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem" }}>
        {items.map((act, i) => (
          <Link
            key={i}
            to={act.path}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.875rem 0.5rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-color)",
              textDecoration: "none",
              color: "var(--text-main)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              transition: "var(--transition)",
            }}
          >
            {act.icon}
            <span>{act.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
