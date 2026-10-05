
export default function Button({
  children,
  variant = "primary", // primary, secondary, outline, danger
  size = "md", // sm, md, lg
  disabled = false,
  onClick,
  type = "button",
  style = {},
  className = "",
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          background: "var(--secondary)",
          color: "#fff",
          border: "none",
        };
      case "outline":
        return {
          background: "transparent",
          color: "var(--text-main)",
          border: "1px solid var(--border-color)",
        };
      case "danger":
        return {
          background: "#EF4444",
          color: "#fff",
          border: "none",
        };
      default:
        return {
          background: "var(--primary)",
          color: "#fff",
          border: "none",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { padding: "0.25rem 0.5rem", fontSize: "0.75rem" };
      case "lg":
        return { padding: "0.75rem 1.5rem", fontSize: "1rem" };
      default:
        return { padding: "0.5rem 1rem", fontSize: "0.875rem" };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: "var(--radius-md)",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "var(--transition)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
