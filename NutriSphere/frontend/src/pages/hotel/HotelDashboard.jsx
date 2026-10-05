import { useState, useEffect } from "react";
import api from "../../services/api";
import { Utensils, ShoppingBag, CheckCircle } from "lucide-react";

export default function HotelDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/hotel");
        setOrders(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading-screen">Loading Kitchen Display...</div>;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Kitchen & Operations Dashboard</h2>
        <p className="text-muted">Manage menu items and incoming patient orders.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", padding: "1rem", borderRadius: "50%" }}>
            <ShoppingBag size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", margin: 0 }}>{orders.filter(o => o.status === 'PENDING').length}</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>Pending Orders</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", padding: "1rem", borderRadius: "50%" }}>
            <Utensils size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", margin: 0 }}>{orders.filter(o => o.status === 'PREPARING').length}</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>In Preparation</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--secondary)", padding: "1rem", borderRadius: "50%" }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", margin: 0 }}>{orders.filter(o => o.status === 'COMPLETED').length}</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>Completed Today</p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem 0" }}>Order ID</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem 0", fontWeight: 500 }}>#{order.id}</td>
                  <td>
                    <span style={{ 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "var(--radius-sm)", 
                      fontSize: "0.75rem",
                      background: order.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: order.status === 'PENDING' ? '#F59E0B' : 'var(--secondary)'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
