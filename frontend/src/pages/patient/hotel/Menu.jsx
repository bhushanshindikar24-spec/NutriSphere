import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { hotelService } from "../../../services/hotelService";
import { formatCurrency } from "../../../utils/formatters";
import { 
  ShoppingBag, 
  Search, 
  Utensils, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  FileText, 
  CreditCard, 
  Plus, 
  Clock, 
  ArrowRight,
  Leaf,
  Flame,
  Award
} from "lucide-react";

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart, cartItems, totalAmount, totalCalories } = useContext(CartContext);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [addedNotice, setAddedNotice] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await hotelService.getAvailableMeals();
        const items = res.data?.data || res.data || [];
        if (Array.isArray(items)) {
          setMeals(items);
        } else {
          setMeals([]);
        }
      } catch (err) {
        console.error("Failed to load culinary meals:", err);
        setError("Unable to load the culinary menu. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleAdd = (meal) => {
    addToCart(meal);
    setAddedNotice(`Added "${meal.name}" to your therapeutic plate!`);
    setTimeout(() => setAddedNotice(""), 2800);
  };

  const filtered = meals.filter((m) => {
    const cat = (m.category || "").toUpperCase();
    let matchesCat = true;
    if (category === "ALL") matchesCat = true;
    else if (category === "BREAKFAST") matchesCat = cat === "BREAKFAST";
    else if (category === "LUNCH") matchesCat = cat === "LUNCH";
    else if (category === "DINNER") matchesCat = cat === "DINNER";
    else if (category === "SNACK") matchesCat = cat === "SNACK";
    else if (category === "HIGH_PROTEIN") matchesCat = (m.proteinG || 0) >= 20;
    else if (category === "VEG") matchesCat = Boolean(m.vegetarian);

    const matchesSearch = (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
                          (m.description || "").toLowerCase().includes(search.toLowerCase()) ||
                          (m.allergens || "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: "1rem",
        color: "#78350f"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid #fef3c7",
          borderTop: "4px solid #d97706",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Loading NutriSphere Culinary Kitchen Dishes...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      {/* 1. Grand Gourmet Culinary Banner (Warm Saffron, Honey Amber & Earthy Slate - NO RED) */}
      <div style={{
        background: "linear-gradient(135deg, #1c1917 0%, #292524 45%, #44403c 100%)",
        color: "#ffffff",
        padding: "2.5rem",
        borderRadius: "24px",
        boxShadow: "0 16px 36px -6px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(254, 243, 199, 0.12)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
            <span style={{
              background: "rgba(245, 158, 11, 0.18)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fde68a",
              padding: "0.25rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}>
              <Award size={14} color="#f59e0b" /> ICMR Calibrated Indian Therapeutic Kitchen
            </span>
            <span style={{
              background: "rgba(16, 185, 129, 0.18)",
              color: "#a7f3d0",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.76rem",
              fontWeight: 700
            }}>
              🟢 Live Kitchen Active • BKC Mumbai
            </span>
            <span style={{ fontSize: "0.82rem", color: "#fef3c7" }}>
              ★ 4.9 Rating (1,240+ Delivered Patients)
            </span>
          </div>

          <h1 style={{ fontSize: "2.35rem", fontWeight: 800, margin: "0 0 0.85rem 0", color: "#ffffff", letterSpacing: "-0.02em" }}>
            NutriSphere Partner Kitchen & Gourmet Dining
          </h1>
          <p style={{ maxWidth: "780px", lineHeight: 1.6, fontSize: "1rem", color: "#e7e5e4", margin: "0 0 1.5rem 0" }}>
            Freshly prepared by certified clinical chefs using authentic Indian whole grains, A2 desi cow ghee, cold-pressed oils, and Sendha namak. Every dish is dynamically fetched from our central kitchen database and aligned with your clinical targets.
          </p>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.86rem", color: "#f5f5f4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={16} color="#fbbf24" />
              <span>Prep & Delivery: <strong>20-35 Mins IST</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ShieldCheck size={16} color="#34d399" />
              <span>License: <strong>FSSAI-LIC-11524999000123</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle2 size={16} color="#fbbf24" />
              <span>Delivery Fee: <strong>₹40 (Flat across Mumbai)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hotel Navigation Section Tabs Bar (Warm Golden & Fresh Ivory Theme) */}
      <div style={{
        background: "#ffffff",
        padding: "0.85rem 1.25rem",
        borderRadius: "18px",
        border: "1.5px solid #fde68a",
        boxShadow: "0 3px 12px rgba(217, 119, 6, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        overflowX: "auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexShrink: 0 }}>
          <button
            onClick={() => {}}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              boxShadow: "0 3px 8px rgba(217, 119, 6, 0.25)"
            }}
          >
            <Utensils size={16} /> Therapeutic Menu
          </button>

          <button
            onClick={() => navigate("/patient/hotel/cart")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              background: "#fffbeb",
              color: "#78350f",
              border: "1px solid #fde68a",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fef3c7"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fffbeb"}
          >
            <ShoppingBag size={16} color="#d97706" /> Meal Cart
            {cartCount > 0 && (
              <span style={{ background: "#d97706", color: "#fff", fontSize: "0.72rem", padding: "0.1rem 0.45rem", borderRadius: "9999px", fontWeight: 800 }}>
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/patient/hotel/checkout")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              background: "#fffbeb",
              color: "#78350f",
              border: "1px solid #fde68a",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fef3c7"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fffbeb"}
          >
            <CreditCard size={16} color="#d97706" /> Express Checkout
          </button>

          <button
            onClick={() => navigate("/patient/hotel/orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              background: "#fffbeb",
              color: "#78350f",
              border: "1px solid #fde68a",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fef3c7"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fffbeb"}
          >
            <Truck size={16} color="#d97706" /> Live Tracking
          </button>

          <button
            onClick={() => navigate("/patient/hotel/kitchen-profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              background: "#fffbeb",
              color: "#78350f",
              border: "1px solid #fde68a",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fef3c7"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fffbeb"}
          >
            <ShieldCheck size={16} color="#059669" /> Kitchen & FSSAI
          </button>

          <button
            onClick={() => navigate("/patient/hotel/custom-request")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              background: "#fffbeb",
              color: "#78350f",
              border: "1px solid #fde68a",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fef3c7"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fffbeb"}
          >
            <Sparkles size={16} color="#d97706" /> Custom Meal Rx
          </button>
        </div>

        <button
          onClick={() => navigate("/patient/hotel/cart")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "0.6rem 1.15rem",
            fontWeight: 700,
            fontSize: "0.86rem",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(217, 119, 6, 0.25)"
          }}
        >
          <ShoppingBag size={17} /> View Cart ({cartCount})
        </button>
      </div>

      {addedNotice && (
        <div style={{
          background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
          color: "#065f46",
          padding: "0.85rem 1.25rem",
          borderRadius: "14px",
          border: "1.5px solid #a7f3d0",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontWeight: 600,
          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)"
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{addedNotice}</span>
        </div>
      )}

      {error && (
        <div style={{
          background: "#fffbeb",
          color: "#92400e",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid #fde68a"
        }}>
          {error}
        </div>
      )}

      {/* 3. Search and Dietary Filters */}
      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <Search size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search healthy Indian meals, thalis, jowar bhakri, khichdi, paneer, poha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              paddingLeft: "3rem",
              width: "100%",
              height: "48px",
              borderRadius: "14px",
              fontSize: "0.95rem",
              border: "1.5px solid #e2e8f0",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            { id: "ALL", label: "All Culinary Dishes" },
            { id: "BREAKFAST", label: "Subah ka Nashta (Breakfast)" },
            { id: "LUNCH", label: "Dopahar ka Bhojan (Thali)" },
            { id: "SNACK", label: "Shaam ka Nashta (Snack)" },
            { id: "DINNER", label: "Raat ka Khana (Dinner)" },
            { id: "HIGH_PROTEIN", label: "High Protein (20g+)" },
            { id: "VEG", label: "Pure Vegetarian" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: category === cat.id ? "1.5px solid #d97706" : "1.5px solid #e2e8f0",
                background: category === cat.id ? "#fef3c7" : "#ffffff",
                color: category === cat.id ? "#78350f" : "#475569",
                fontWeight: category === cat.id ? 700 : 500,
                fontSize: "0.84rem",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Food Menu Cards Grid with Appetizing Culinary Presentation */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "1.75rem" }}>
        {filtered.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "3rem",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px dashed #cbd5e1",
            color: "#64748b"
          }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No meals found matching your search.</p>
            <button
              onClick={() => { setSearch(""); setCategory("ALL"); }}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                background: "#fef3c7",
                color: "#78350f",
                border: "1px solid #fde68a",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((meal) => (
            <div
              key={meal.id}
              style={{
                padding: "1.15rem",
                borderRadius: "20px",
                border: "1.5px solid #fef3c7",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 14px 28px -6px rgba(217, 119, 6, 0.14)";
                e.currentTarget.style.borderColor = "#fcd34d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.borderColor = "#fef3c7";
              }}
            >
              <div>
                {/* Meal Image with Accurate Matching Photos */}
                <div style={{ position: "relative", marginBottom: "0.85rem", overflow: "hidden", borderRadius: "14px" }}>
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    style={{
                      width: "100%",
                      height: "190px",
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "14px",
                      transition: "transform 0.3s ease"
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600";
                    }}
                  />
                  
                  {/* Category Pill */}
                  <span style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "rgba(15, 23, 42, 0.75)",
                    backdropFilter: "blur(4px)",
                    color: "#ffffff",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    letterSpacing: "0.03em"
                  }}>
                    {meal.category || "THERAPEUTIC"}
                  </span>

                  {/* Veg / Non-Veg Badge */}
                  <span style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    background: meal.vegetarian ? "rgba(16, 185, 129, 0.92)" : "rgba(180, 83, 9, 0.92)",
                    backdropFilter: "blur(4px)",
                    color: "#ffffff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.6rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}>
                    {meal.vegetarian ? <Leaf size={11} /> : <Flame size={11} />}
                    <span>{meal.vegetarian ? (meal.vegan ? "Pure Vegan" : "Vegetarian") : "Non-Veg Protein"}</span>
                  </span>

                  {/* Prep Time */}
                  {meal.preparationTimeMin && (
                    <span style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(0, 0, 0, 0.65)",
                      color: "#fef3c7",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      <Clock size={11} /> {meal.preparationTimeMin}m
                    </span>
                  )}
                </div>

                {/* Title & Price in INR */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.08rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
                    {meal.name}
                  </h3>
                  <span style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#b45309",
                    whiteSpace: "nowrap"
                  }}>
                    {formatCurrency(meal.price)}
                  </span>
                </div>

                <p style={{
                  color: "#64748b",
                  fontSize: "0.83rem",
                  lineHeight: 1.5,
                  margin: "0 0 0.85rem 0",
                  minHeight: "42px"
                }}>
                  {meal.description}
                </p>

                {/* Nutritional Macro Strip (Warm Cream & Saffron - Appetizing) */}
                <div style={{
                  background: "linear-gradient(135deg, #fffbeb 0%, #fefce8 100%)",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "12px",
                  border: "1px solid #fef3c7",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  textAlign: "center",
                  gap: "0.25rem",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <div style={{ fontSize: "0.67rem", color: "#92400e", fontWeight: 600 }}>Energy</div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#78350f" }}>{Math.round(meal.calories || 0)} kcal</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.67rem", color: "#92400e", fontWeight: 600 }}>Protein</div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#059669" }}>{Math.round(meal.proteinG || 0)}g</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.67rem", color: "#92400e", fontWeight: 600 }}>Carbs</div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#78350f" }}>{Math.round(meal.carbsG || 0)}g</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.67rem", color: "#92400e", fontWeight: 600 }}>Fats</div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#78350f" }}>{Math.round(meal.fatG || 0)}g</div>
                  </div>
                </div>
              </div>

              {/* Add to Plate Button */}
              <button
                onClick={() => handleAdd(meal)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 3px 10px rgba(217, 119, 6, 0.25)",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 14px rgba(217, 119, 6, 0.32)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 3px 10px rgba(217, 119, 6, 0.25)";
                }}
              >
                <Plus size={18} /> Add to Therapeutic Plate
              </button>
            </div>
          ))
        )}
      </div>

      {/* 5. Sticky Floating Plate Summary Bar */}
      {cartCount > 0 && (
        <div style={{
          position: "sticky",
          bottom: "1.5rem",
          zIndex: 40,
          background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
          color: "#ffffff",
          padding: "1rem 1.75rem",
          borderRadius: "18px",
          boxShadow: "0 14px 32px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(254, 243, 199, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>🧺</span>
              <strong style={{ fontSize: "1.05rem", color: "#fef3c7" }}>
                {cartCount} item{cartCount > 1 ? "s" : ""} on your plate
              </strong>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#d6d3d1", marginTop: "0.2rem" }}>
              Estimated Total: <strong style={{ color: "#fbbf24" }}>{formatCurrency(totalAmount)}</strong> • {Math.round(totalCalories)} kcal cumulative intake
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => navigate("/patient/hotel/cart")}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                padding: "0.6rem 1.15rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.86rem",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.22)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
            >
              View Plate
            </button>
            <button
              onClick={() => navigate("/patient/hotel/checkout")}
              style={{
                background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                color: "#ffffff",
                border: "none",
                padding: "0.6rem 1.35rem",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.86rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                boxShadow: "0 2px 8px rgba(217, 119, 6, 0.35)",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            >
              <span>Instant Checkout</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
