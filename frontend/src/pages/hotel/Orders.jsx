import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "../../components/hotel/OrderStatusBadge";
import api from "../../services/api";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      let res;
      try {
        res = await api.get("/orders/hotel");
      } catch (_hotelErr) {
        res = await api.get("/orders");
      }
      setOrders(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch kitchen orders:", err);
      setOrders([]);
      setError("Unable to fetch orders. Please check network connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (_err) {
      try {
        await api.put(`/orders/${orderId}/status`, { status: newStatus });
      } catch (_putErr) {}
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

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>
            {error ? "Unable to Fetch Orders" : "No Order History"}
          </h4>
          <p>{error || "No order history or incoming kitchen orders found."}</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
