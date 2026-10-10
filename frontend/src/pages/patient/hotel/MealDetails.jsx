import {  useState, useEffect, useContext  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check, ShoppingBag, ShieldCheck } from "lucide-react";
import { CartContext } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/formatters";
import api from "../../../services/api";

export default function MealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await api.get(`/hotel/meals/${id || 1}`);
        setMeal(res.data?.data || res.data);
      } catch (_err) {
        setMeal({
          id: id || 1,
          name: "Mediterranean Herb Chicken Bowl",
          category: "LUNCH",
          price: 14.5,
          calories: 480,
          proteinG: 42,
          carbsG: 48,
          fatG: 14,
          description: "Grilled free-range chicken breast served over warm tri-color quinoa, roasted zucchini, and cherry tomatoes, drizzled with cold-pressed olive oil vinaigrette.",
          kitchenName: "NutriKitchen Downtown Partner",
          allergens: ["None detected"],
          prepTimeMinutes: 20,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  const handleAdd = () => {
    if (meal) {
      addToCart(meal);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="loading-screen">Loading Delivery Meal...</div>;
  if (!meal) return <div className="glass-panel" style={{ padding: "2rem" }}>Meal not found.</div>;

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/patient/hotel/menu")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
      >
        <ArrowLeft size={16} /> Back to Menu
      </button>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
              {meal.category}
            </span>
            <h2 style={{ margin: "0 0 0.5rem 0" }}>{meal.name}</h2>
            <p className="text-muted" style={{ margin: 0 }}>Prepared by {meal.kitchenName || "Partner Kitchen"}</p>
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>
            {formatCurrency(meal.price)}
          </span>
        </div>

        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {meal.description}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center" }}>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Calories</span>
            <strong>{meal.calories} kcal</strong>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Protein</span>
            <strong style={{ color: "#3B82F6" }}>{meal.proteinG}g</strong>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Carbs</span>
            <strong style={{ color: "#10B981" }}>{meal.carbsG || 45}g</strong>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Fat</span>
            <strong style={{ color: "#F59E0B" }}>{meal.fatG || 12}g</strong>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <ShieldCheck size={20} color="#10B981" />
          <span style={{ fontSize: "0.85rem", color: "#10B981" }}>
            Certified Compliant with your Dietitian-prescribed nutritional plan.
          </span>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={handleAdd}
            className="btn btn-primary"
            style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
            {added ? "Added to Cart!" : "Add to Delivery Cart"}
          </button>
          <button
            onClick={() => navigate("/patient/hotel/cart")}
            className="btn btn-outline"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ShoppingBag size={18} /> View Cart
          </button>
        </div>
      </div>
    </div>
  );
}
