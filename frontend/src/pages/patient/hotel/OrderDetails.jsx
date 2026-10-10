import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import OrderStatusBadge from "../../../components/hotel/OrderStatusBadge";
import OrderTimeline from "../../../components/hotel/OrderTimeline";
import api from "../../../services/api";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id || 1}`);
        setOrder(res.data?.data || res.data);
      } catch (_err) {
        setOrder({
          id: id || "ORD-9412",
          status: "IN_PREPARATION",
          createdAt: new Date().toISOString(),
          estimatedDelivery: "35 Minutes",
          totalPrice: 28.5,
          deliveryAddress: "142 Elmwood Ave, Cambridge, MA",
          notes: "Please leave at front door.",
          items: [
            { mealName: "Mediterranean Herb Chicken Bowl", quantity: 1, price: 14.5, calories: 480 },
            { mealName: "Crispy Tofu & Edamame Salad", quantity: 1, price: 10.5, calories: 410 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Order Details...</div>;
  if (!order) return <div className="glass-panel" style={{ padding: "2rem" }}>Order not found.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/patient/hotel/orders")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: "0 0 0.25rem 0" }}>Order #{order.id}</h2>
            <span className="text-muted" style={{ fontSize: "0.85rem" }}>
              Placed on {formatDate(order.createdAt)}
            </span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Live Delivery Timeline */}
        <div style={{ margin: "1.5rem 0", padding: "1.5rem", background: "rgba(255, 255, 255, 0.02)", borderRadius: "var(--radius-md)" }}>
          <h4 style={{ margin: "0 0 1rem 0" }}>Delivery Progress</h4>
          <OrderTimeline currentStatus={order.status} />
        </div>

        {/* Items */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Items Ordered</h4>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--border-color)",
                  fontSize: "0.9rem",
                }}
              >
                <div>
                  <strong>{item.quantity}x {item.mealName}</strong>
                  {item.calories && (
                    <span className="text-muted" style={{ display: "block", fontSize: "0.75rem" }}>
                      {item.calories} kcal each
                    </span>
                  )}
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <strong>Delivery Destination:</strong>
            <p style={{ margin: "0.25rem 0 0 0" }}>{order.deliveryAddress}</p>
            {order.notes && <p className="text-muted" style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem" }}>Note: {order.notes}</p>}
          </div>
        </div>

        {/* Total Price */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
          <strong>Total Paid</strong>
          <strong style={{ color: "var(--primary)" }}>{formatCurrency(order.totalPrice || order.totalAmount)}</strong>
        </div>
      </div>
    </div>
  );
}
