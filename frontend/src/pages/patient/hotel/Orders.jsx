import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import OrderStatusBadge from "../../../components/hotel/OrderStatusBadge";
import api from "../../../services/api";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let res;
        try {
          res = await api.get("/orders/my");
        } catch (_myErr) {
          res = await api.get("/orders");
        }
        setOrders(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
        setError("Unable to fetch orders. Please check your connection or try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading-screen">Loading Delivery Orders...</div>;

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>My Meal Deliveries</h2>
          <p className="text-muted">Track the live progress of your clinical kitchen orders.</p>
        </div>
        <button onClick={() => navigate("/patient/hotel/menu")} className="btn btn-primary">
          Order New Meal
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          <Package size={40} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
          <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>
            {error ? "Unable to Fetch Orders" : "No Order History"}
          </h4>
          <p>
            {error 
              ? error 
              : "No order history found. Browse our partner menu to order fresh, dietitian-approved meals."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {orders.map((order) => (
            <div
              key={order.id}
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1.05rem" }}>Order #{order.id}</h4>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "1rem" }}>
                  <span>{formatDate(order.createdAt)}</span>
                  <span>•</span>
                  <span>{order.items?.length || 1} items</span>
                  <span>•</span>
                  <strong style={{ color: "var(--text-main)" }}>{formatCurrency(order.totalPrice || order.totalAmount)}</strong>
                </div>
              </div>

              <button
                onClick={() => navigate(`/patient/hotel/orders/${order.id}`)}
                className="btn btn-outline"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
              >
                View Details <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
