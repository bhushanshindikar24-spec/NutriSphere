
export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "1.5rem",
        overflowX: "auto",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              padding: "0.75rem 1.25rem",
              background: "transparent",
              border: "none",
              borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
              color: isActive ? "var(--primary)" : "var(--text-muted)",
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "var(--transition)",
              whiteSpace: "nowrap",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
