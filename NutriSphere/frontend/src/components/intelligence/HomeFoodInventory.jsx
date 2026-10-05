import {  useState  } from "react";
import { Plus, Trash2, Package, Search } from "lucide-react";

export default function HomeFoodInventory({
  items = [],
  onAddItem,
  onRemoveItem,
  isLoading = false,
}) {
  const [newItemName, setNewItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("GRAINS");
  const [search, setSearch] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    if (onAddItem) {
      onAddItem({
        foodName: newItemName.trim(),
        quantity: quantity.trim() || "1 unit",
        category,
      });
    }
    setNewItemName("");
    setQuantity("");
  };

  const filteredItems = items.filter((item) => {
    const name = item.foodName || item.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Package size={20} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Home Pantry Inventory</h3>
        </div>
        <span className="badge badge-primary">{items.length} items available</span>
      </div>

      {/* Add Item Form */}
      {onAddItem && (
        <form
          onSubmit={handleAdd}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
          }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Ingredient / Food (e.g. Rolled Oats)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Qty (e.g. 500g)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="GRAINS">Grains & Cereals</option>
            <option value="PROTEINS">Proteins & Dairy</option>
            <option value="VEGETABLES">Vegetables</option>
            <option value="FRUITS">Fruits</option>
            <option value="OILS_SPICES">Oils & Spices</option>
            <option value="SNACKS">Snacks & Other</option>
          </select>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            <Plus size={16} /> Add
          </button>
        </form>
      )}

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <Search
          size={16}
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Filter pantry ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "2.25rem", width: "100%" }}
        />
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
          No pantry items found. Add ingredients above to generate personalized home recipes!
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
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
              <div>
                <strong style={{ fontSize: "0.9rem", display: "block" }}>
                  {item.foodName || item.name}
                </strong>
                <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {item.quantity || "In stock"} {item.category ? `• ${item.category}` : ""}
                </span>
              </div>
              {onRemoveItem && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id || idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
