
export default function StatCard({
  title,
  value,
  subtext,
  icon,
  iconColor = "var(--primary)",
  iconBg = "var(--primary-light)",
  trend,
  trendPositive = true,
}) {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            {title}
          </p>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
            {value}
          </h3>
        </div>
        {icon && (
          <div
            style={{
              background: iconBg,
              color: iconColor,
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
          {trend && (
            <span style={{ color: trendPositive ? "#10B981" : "#EF4444", fontWeight: 600 }}>
              {trend}
            </span>
          )}
          {subtext && <span className="text-muted">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
