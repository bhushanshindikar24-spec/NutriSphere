import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import Badge from "../../components/common/Badge";
import api from "../../services/api";

export default function Menu() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async () => {
    try {
      const res = await api.get("/hotel/meals");
      setMeals(res.data?.data || res.data || []);
    } catch (_err) {
      setMeals([
        {
          id: 1,
          name: "Mediterranean Herb Chicken Bowl",
          category: "LUNCH",
          price: 14.5,
          calories: 480,
          proteinG: 42,
          isAvailable: true,
        },
        {
          id: 2,
          name: "Wild Salmon & Steamed Asparagus",
          category: "DINNER",
          price: 18.0,
          calories: 520,
          proteinG: 38,
          isAvailable: true,
        },
        {
          id: 3,
          name: "Steel-Cut Berry Protein Oatmeal",
          category: "BREAKFAST",
          price: 9.0,
          calories: 360,
          proteinG: 18,
          isAvailable: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    fetchMeals();
  }, []);

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await api.put(`/hotel/meals/${id}/availability`, { isAvailable: !currentStatus });
      setMeals((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isAvailable: !currentStatus } : m))
      );
    } catch (_err) {
      setMeals((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isAvailable: !currentStatus } : m))
      );
    }
  };

  const handleDeleteMeal = async (id) => {
    if (!window.confirm("Are you sure you want to remove this meal from the menu?")) return;
    try {
      await api.delete(`/hotel/meals/${id}`);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (_err) {
      setMeals((prev) => prev.filter((m) => m.id !== id));
    }
  };

  if (loading) return <div className="loading-screen">Loading Kitchen Menu...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Kitchen Menu Catalog</h2>
          <p className="text-muted">Manage clinical meals offered to patients through NutriSphere delivery.</p>
        </div>
        <button
          onClick={() => navigate("/hotel/add-meal")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={16} /> Add New Menu Item
        </button>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="glass-panel"
            style={{
              padding: "1.25rem 1.5rem",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <Badge variant="neutral">{meal.category}</Badge>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{meal.name}</h3>
              </div>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span>Price: <strong style={{ color: "var(--primary)" }}>{formatCurrency(meal.price)}</strong></span>
                <span>•</span>
                <span>{meal.calories} kcal</span>
                <span>•</span>
                <span>Protein: {meal.proteinG}g</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                onClick={() => handleToggleAvailability(meal.id, meal.isAvailable)}
                className={`btn btn-sm ${meal.isAvailable ? "btn-outline" : "btn-primary"}`}
                style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
              >
                {meal.isAvailable ? <CheckCircle2 size={14} color="#10B981" /> : <XCircle size={14} />}
                {meal.isAvailable ? "In Stock" : "Mark Available"}
              </button>

              <button
                onClick={() => navigate(`/hotel/edit-meal/${meal.id}`)}
                className="btn btn-sm btn-outline"
                style={{ padding: "0.4rem 0.6rem" }}
                title="Edit item"
              >
                <Edit2 size={14} />
              </button>

              <button
                onClick={() => handleDeleteMeal(meal.id)}
                className="btn btn-sm btn-outline"
                style={{ padding: "0.4rem 0.6rem", color: "#EF4444" }}
                title="Delete item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
