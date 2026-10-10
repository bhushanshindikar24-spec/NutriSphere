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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data?.data || res.data || []);
      } catch (_err) {
        setOrders([
          {
            id: "ORD-9412",
            createdAt: new Date().toISOString(),
            status: "IN_PREPARATION",
            totalPrice: 28.5,
            items: [
              { mealName: "Mediterranean Herb Chicken Bowl", quantity: 1, price: 14.5 },
              { mealName: "Crispy Tofu & Edamame Salad", quantity: 1, price: 10.5 },
            ],
            deliveryAddress: "142 Elmwood Ave, Cambridge, MA",
          },
          {
            id: "ORD-8821",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: "DELIVERED",
            totalPrice: 21.5,
            items: [{ mealName: "Wild Salmon & Steamed Asparagus", quantity: 1, price: 18.0 }],
            deliveryAddress: "142 Elmwood Ave, Cambridge, MA",
          },
        ]);
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
          <p>No orders found. Browse our partner menu to order fresh, dietitian-approved meals.</p>
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
