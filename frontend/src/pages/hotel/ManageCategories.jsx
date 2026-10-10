import {  useState  } from "react";
import { Plus, Tag, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 1, name: "Breakfast", count: 4 },
    { id: 2, name: "Lunch", count: 8 },
    { id: 3, name: "Dinner", count: 6 },
    { id: 4, name: "Snacks & Sides", count: 5 },
    { id: 5, name: "Clinical Recovery Broths", count: 2 },
  ]);
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategory.trim(), count: 0 }]);
    setNewCategory("");
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/hotel/menu")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Menu
      </button>

      <h2>Manage Kitchen Categories</h2>

      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input
            type="text"
            className="input-field"
            placeholder="New Category Name (e.g. Keto Friendly Bowls)..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={16} /> Add Category
          </button>
        </form>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Tag size={16} color="var(--primary)" />
                <strong>{c.name}</strong>
                <span className="text-muted" style={{ fontSize: "0.8rem" }}>({c.count} items)</span>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
