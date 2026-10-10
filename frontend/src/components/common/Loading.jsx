
import { Loader2 } from "lucide-react";

export default function Loading({ message = "Loading...", fullScreen = false }) {
  const content = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "2rem" }}>
      <Loader2 size={32} className="animate-spin" color="var(--primary)" />
      <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500 }}>
        {message}
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-surface-glass)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}>
        {content}
      </div>
    );
  }

  return content;
}
