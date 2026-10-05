import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function EditMeal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "LUNCH",
    price: 14.5,
    calories: 480,
    proteinG: 42,
    carbsG: 45,
    fatG: 14,
    description: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await api.get(`/hotel/meals/${id || 1}`);
        const m = res.data?.data || res.data;
        if (m) {
          setFormData({
            name: m.name || "",
            category: m.category || "LUNCH",
            price: m.price || 14.5,
            calories: m.calories || 480,
            proteinG: m.proteinG || 42,
            carbsG: m.carbsG || 45,
            fatG: m.fatG || 14,
            description: m.description || "",
            isAvailable: m.isAvailable !== false,
          });
        }
      } catch (_err) {
        setFormData({
          name: "Mediterranean Herb Chicken Bowl",
          category: "LUNCH",
          price: 14.5,
          calories: 480,
          proteinG: 42,
          carbsG: 45,
          fatG: 14,
          description: "Grilled chicken, wild quinoa, steamed vegetables.",
          isAvailable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/hotel/meals/${id || 1}`, formData);
      navigate("/hotel/menu");
    } catch (_err) {
      navigate("/hotel/menu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Meal...</div>;

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/hotel/menu")}
        className="btn btn-outline"
        style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Menu
      </button>

      <h2>Edit Menu Item</h2>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)", marginTop: "1rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
          <div>
            <label className="form-label">Meal Name</label>
            <input
              type="text"
              className="input-field"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div>
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Calories</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.proteinG}
                onChange={(e) => setFormData({ ...formData, proteinG: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/hotel/menu")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} style={{ marginRight: "0.4rem" }} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
