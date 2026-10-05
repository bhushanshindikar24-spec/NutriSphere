
export default function NotificationBadge({ count = 0, max = 99, showZero = false, dot = false }) {
  if (count <= 0 && !showZero) return null;

  if (dot) {
    return (
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#EF4444",
          display: "inline-block",
        }}
      />
    );
  }

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      style={{
        background: "#EF4444",
        color: "#ffffff",
        fontSize: "0.7rem",
        fontWeight: 700,
        minWidth: "18px",
        height: "18px",
        padding: "0 4px",
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      {displayCount}
    </span>
  );
}
