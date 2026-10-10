
export default function Card({ children, title, subtitle, action, style = {}, className = "" }) {
  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: subtitle ? "0.25rem" : "1rem",
          }}
        >
          {title && <h3 style={{ fontSize: "1.125rem", margin: 0 }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {subtitle && (
        <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
