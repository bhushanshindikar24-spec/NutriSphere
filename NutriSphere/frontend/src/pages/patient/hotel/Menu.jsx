import {  useState, useEffect, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import HotelMealCard from "../../../components/hotel/HotelMealCard";
import { hotelService } from "../../../services/hotelService";
import { ShoppingBag, Search } from "lucide-react";

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [addedNotice, setAddedNotice] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await hotelService.getAvailableMeals();
        setMeals(res.data?.data || res.data || []);
      } catch (_err) {
        // Fallback clinical menu
        setMeals([
          {
            id: 1,
            name: "Mediterranean Herb Chicken Bowl",
            category: "LUNCH",
            price: 14.5,
            calories: 480,
            proteinG: 42,
            description: "Grilled organic chicken breast, quinoa, roast Mediterranean vegetables, tahini dressing.",
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
          },
          {
            id: 2,
            name: "Wild Salmon & Steamed Asparagus",
            category: "DINNER",
            price: 18.0,
            calories: 520,
            proteinG: 38,
            description: "Pan-seared Alaskan sockeye salmon with lemon zest and garlic-steamed tender asparagus.",
            imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
          },
          {
            id: 3,
            name: "Steel-Cut Berry Protein Oatmeal",
            category: "BREAKFAST",
            price: 9.0,
            calories: 360,
            proteinG: 18,
            description: "Slow-simmered organic oats topped with fresh blueberries, chia seeds, and clean whey isolate.",
            imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500",
          },
          {
            id: 4,
            name: "Crispy Tofu & Edamame Power Salad",
            category: "LUNCH",
            price: 13.0,
            calories: 410,
            proteinG: 26,
            description: "Baked sesame tofu cubes, baby kale, shelled edamame, and ginger-miso glaze.",
            imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleAdd = (meal) => {
    addToCart(meal);
    setAddedNotice(`Added "${meal.name}" to cart!`);
    setTimeout(() => setAddedNotice(""), 2500);
  };

  const filtered = meals.filter((m) => {
    const matchesCat = category === "ALL" || m.category === category;
    const matchesSearch = (m.name || "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <div className="loading-screen">Loading Nutrition Delivery Menu...</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Partner Kitchen Delivery Menu</h2>
          <p className="text-muted">Clinically formulated, chef-prepared meals delivered directly to your doorstep.</p>
        </div>
        <button
          onClick={() => navigate("/patient/hotel/cart")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ShoppingBag size={18} /> Cart ({cartCount})
        </button>
      </div>

      {addedNotice && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          {addedNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search healthy menu meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.5rem", width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["ALL", "BREAKFAST", "LUNCH", "DINNER"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-outline"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {filtered.map((meal) => (
          <HotelMealCard key={meal.id} meal={meal} onAddToCart={handleAdd} />
        ))}
      </div>
    </div>
  );
}
