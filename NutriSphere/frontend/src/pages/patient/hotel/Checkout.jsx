import {  useState, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { ArrowLeft, CheckCircle, CreditCard, MapPin } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import api from "../../../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("142 Elmwood Ave, Apt 4B, Cambridge, MA");
  const [deliveryNotes, setDeliveryNotes] = useState("Please leave at front door, ring bell.");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  if (cartItems.length === 0 && !successOrder) {
    return (
      <div style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center" }}>
        <div className="glass-panel" style={{ padding: "3rem" }}>
          <h3>Your cart is empty</h3>
          <button onClick={() => navigate("/patient/hotel/menu")} className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  const [orderError, setOrderError] = useState("");

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError("");
    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map((i) => ({ mealId: i.mealId, quantity: i.quantity, unitPrice: i.price })),
        deliveryAddress: address,
        specialInstructions: deliveryNotes,
        notes: deliveryNotes,
      };

      const res = await api.post("/orders", orderPayload);
      const placed = res.data?.data || res.data;
      setSuccessOrder(placed);
      clearCart();
    } catch (err) {
      console.error("Order placement error", err);
      setOrderError(err.response?.data?.message || "Failed to place culinary order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
        <div className="glass-panel" style={{ padding: "3rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <CheckCircle size={36} />
          </div>
          <h2>Order Confirmed!</h2>
          <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
            Your clinical meal order has been transmitted to the partner kitchen.
          </p>

          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span className="text-muted">Order Reference:</span>
              <strong>#{successOrder.id}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Estimated Delivery:</span>
              <strong style={{ color: "var(--primary)" }}>35 - 45 Minutes</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => navigate("/patient/hotel/orders")}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Track Order Status
            </button>
            <button
              onClick={() => navigate("/patient")}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/patient/hotel/cart")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h2>Delivery Checkout</h2>

      {orderError && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem" }}>
          {orderError}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: "grid", gap: "1.5rem" }}>
        {/* Address */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <h4 style={{ margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={18} color="var(--primary)" /> Delivery Location
          </h4>
          <input
            type="text"
            className="input-field"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: "100%", marginBottom: "0.75rem" }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Delivery instructions (e.g. gate code, apt #)..."
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {/* Payment */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <h4 style={{ margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CreditCard size={18} color="var(--primary)" /> Payment Method
          </h4>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {[
              { id: "CREDIT_CARD", label: "Credit / Debit Card (Visa, Mastercard)" },
              { id: "HEALTH_SAVINGS", label: "HSA / FSA Health Savings Account" },
              { id: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
            ].map((p) => (
              <label
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: paymentMethod === p.id ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === p.id}
                  onChange={() => setPaymentMethod(p.id)}
                />
                <span style={{ fontSize: "0.9rem" }}>{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Total & Submit */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="text-muted" style={{ fontSize: "0.8rem", display: "block" }}>Final Order Total</span>
            <strong style={{ fontSize: "1.5rem", color: "var(--primary)" }}>{formatCurrency(totalAmount + 3.5)}</strong>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: "0.75rem 2rem" }}>
            {loading ? "Confirming Order..." : "Place Delivery Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
