import {  useContext  } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount, totalCalories } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center" }}>
        <div className="glass-panel" style={{ padding: "3rem", borderRadius: "var(--radius-lg)" }}>
          <ShoppingBag size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
          <h3>Your Delivery Cart is Empty</h3>
          <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
            Explore physician-compatible meals crafted by licensed commercial kitchens.
          </p>
          <button onClick={() => navigate("/patient/hotel/menu")} className="btn btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate("/patient/hotel/menu")}
          className="btn btn-outline"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <ArrowLeft size={16} /> Continue Shopping
        </button>
        <button onClick={clearCart} className="btn btn-sm btn-outline" style={{ color: "#EF4444" }}>
          Clear Cart
        </button>
      </div>

      <h2>Your Meal Delivery Cart</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Cart Item List */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1rem" }}>
          {cartItems.map((item) => (
            <div
              key={item.mealId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>{item.mealName}</h4>
                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {formatCurrency(item.price)} • {item.calories} kcal each
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => updateQuantity(item.mealId, item.quantity - 1)}
                    className="btn btn-sm btn-outline"
                    style={{ padding: "0.2rem 0.5rem" }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ fontWeight: 600, minWidth: "20px", textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.mealId, item.quantity + 1)}
                    className="btn btn-sm btn-outline"
                    style={{ padding: "0.2rem 0.5rem" }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <span style={{ fontWeight: 700, minWidth: "60px", textAlign: "right" }}>
                  {formatCurrency(item.price * item.quantity)}
                </span>

                <button
                  onClick={() => removeFromCart(item.mealId)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", height: "fit-content" }}>
          <h4 style={{ margin: "0 0 1rem 0" }}>Order Summary</h4>

          <div style={{ display: "grid", gap: "0.75rem", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Total Calories:</span>
              <strong>{totalCalories} kcal</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Subtotal:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Clinical Delivery:</span>
              <span>{formatCurrency(3.5)}</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
              <strong>Total:</strong>
              <strong style={{ color: "var(--primary)" }}>{formatCurrency(totalAmount + 3.5)}</strong>
            </div>
          </div>

          <button
            onClick={() => navigate("/patient/hotel/checkout")}
            className="btn btn-primary"
            style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
