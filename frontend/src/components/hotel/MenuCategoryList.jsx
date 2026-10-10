
export default function MenuCategoryList({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
      <button
        onClick={() => onSelectCategory(null)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          border: "1px solid var(--border-color)",
          background: selectedCategory === null ? "var(--primary)" : "var(--bg-surface)",
          color: selectedCategory === null ? "#fff" : "var(--text-main)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "var(--transition)",
        }}
      >
        All Meals
      </button>

      {categories.map((cat, i) => {
        const catName = typeof cat === "string" ? cat : cat.name;
        const isSelected = selectedCategory === catName;
        return (
          <button
            key={i}
            onClick={() => onSelectCategory(catName)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "1px solid var(--border-color)",
              background: isSelected ? "var(--primary)" : "var(--bg-surface)",
              color: isSelected ? "#fff" : "var(--text-main)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "var(--transition)",
            }}
          >
            {catName}
          </button>
        );
      })}
    </div>
  );
}
