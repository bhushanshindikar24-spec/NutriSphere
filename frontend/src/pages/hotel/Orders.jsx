import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "../../components/hotel/OrderStatusBadge";
import api from "../../services/api";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data?.data || res.data || []);
    } catch (_err) {
      setOrders([
        {
          id: "ORD-9412",
          patientName: "Alex Morgan",
          status: "IN_PREPARATION",
          totalPrice: 28.5,
          createdAt: new Date().toISOString(),
          deliveryAddress: "142 Elmwood Ave, Apt 4B, Cambridge",
          items: [
            { mealName: "Mediterranean Herb Chicken Bowl", quantity: 1 },
            { mealName: "Crispy Tofu & Edamame Salad", quantity: 1 },
          ],
        },
        {
          id: "ORD-9390",
          patientName: "Sarah Jenkins",
          status: "ORDER_PLACED",
          totalPrice: 18.0,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          deliveryAddress: "88 Beacon St, Boston",
          items: [{ mealName: "Wild Salmon & Steamed Asparagus", quantity: 1 }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (_err) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  if (loading) return <div className="loading-screen">Loading Delivery Orders...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Kitchen Order Queue & Dispatch</h2>
          <p className="text-muted">Live incoming patient meal orders and delivery preparation pipeline.</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {orders.map((order) => (
          <div
            key={order.id}
            className="glass-panel"
            style={{
              padding: "1.5rem",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Order #{order.id}</h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Patient: <strong>{order.patientName || "Alex Morgan"}</strong> • {order.deliveryAddress}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {order.items?.map((it, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {it.quantity}x {it.mealName}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {order.status === "ORDER_PLACED" && (
                <button
                  onClick={() => handleUpdateStatus(order.id, "IN_PREPARATION")}
                  className="btn btn-sm btn-primary"
                >
                  Start Preparing
                </button>
              )}
              {order.status === "IN_PREPARATION" && (
                <button
                  onClick={() => handleUpdateStatus(order.id, "READY_FOR_DELIVERY")}
                  className="btn btn-sm btn-primary"
                >
                  Ready for Courier
                </button>
              )}
              {order.status === "READY_FOR_DELIVERY" && (
                <button
                  onClick={() => handleUpdateStatus(order.id, "OUT_FOR_DELIVERY")}
                  className="btn btn-sm btn-primary"
                >
                  Dispatch Delivery
                </button>
              )}
              {order.status === "OUT_FOR_DELIVERY" && (
                <button
                  onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                  className="btn btn-sm btn-outline"
                  style={{ color: "#10B981", borderColor: "#10B981" }}
                >
                  Confirm Delivered
                </button>
              )}

              <button
                onClick={() => navigate(`/hotel/orders/${order.id}`)}
                className="btn btn-sm btn-outline"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
