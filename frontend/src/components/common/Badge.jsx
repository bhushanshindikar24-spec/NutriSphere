
export default function Badge({
  children,
  variant = "primary", // primary, success, warning, danger, neutral
  style = {},
}) {
  const getColors = () => {
    switch (variant) {
      case "success":
      case "APPROVED":
      case "DELIVERED":
        return { bg: "rgba(16, 185, 129, 0.12)", text: "#10B981" };
      case "warning":
      case "PENDING":
      case "PENDING_APPROVAL":
      case "PREPARING":
        return { bg: "rgba(245, 158, 11, 0.12)", text: "#F59E0B" };
      case "danger":
      case "REJECTED":
      case "CANCELLED":
        return { bg: "rgba(239, 68, 68, 0.12)", text: "#EF4444" };
      case "neutral":
      case "DRAFT":
        return { bg: "rgba(148, 163, 184, 0.15)", text: "var(--text-muted)" };
      default:
        return { bg: "var(--primary-light)", text: "var(--primary)" };
    }
  };

  const colors = getColors();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.65rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "capitalize",
        background: colors.bg,
        color: colors.text,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
