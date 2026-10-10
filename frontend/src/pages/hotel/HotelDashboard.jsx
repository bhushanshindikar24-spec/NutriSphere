import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Utensils, ShoppingBag, CheckCircle, Clock, ArrowRight } from "lucide-react";

export default function HotelDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/hotel");
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Error fetching kitchen orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px", gap: "0.75rem", color: "#0284c7" }}>
      <div className="spinner" />
      <span style={{ fontWeight: 600 }}>Loading Kitchen Operations...</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#0f172a", letterSpacing: "-0.02em" }}>
            Kitchen & Culinary Operations
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
            Manage therapeutic culinary preparation, review patient dietary orders, and track fulfillment status.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/hotel/menu" className="btn btn-primary" style={{ gap: "0.4rem" }}>
            <Utensils size={18} /> Culinary Menu
          </Link>
          <Link to="/hotel/orders" className="btn btn-outline" style={{ gap: "0.4rem" }}>
            <ShoppingBag size={18} /> All Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#fffbeb", color: "#d97706", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <Clock size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>
              {orders.filter(o => o.status === 'PENDING').length}
            </h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Pending Preparation</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#e0f2fe", color: "#0284c7", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <Utensils size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>
              {orders.filter(o => o.status === 'PREPARING').length}
            </h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Active in Kitchen</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#ecfdf5", color: "#059669", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>
              {orders.filter(o => o.status === 'COMPLETED').length}
            </h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Fulfilled Today</p>
          </div>
        </div>
      </div>

      {/* Orders Table Panel */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShoppingBag size={20} color="#0284c7" /> Live Incoming Patient Orders
          </h3>
          <Link to="/hotel/orders" style={{ fontSize: "0.85rem", color: "#0284c7", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            View Order Queue <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e2e8f0", borderRadius: "14px", background: "#f8fafc" }}>
            <ShoppingBag size={40} style={{ color: "#94a3b8", opacity: 0.6, marginBottom: "0.75rem" }} />
            <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>No active culinary orders</p>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
              Incoming therapeutic meal orders from prescribed patients will appear here in real time.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Clinical Status</th>
                  <th>Total Amount</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((order) => {
                  const isPending = order.status === 'PENDING';
                  const isPreparing = order.status === 'PREPARING';
                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 700, color: "#0f172a" }}>#{order.id}</td>
                      <td>
                        <span className={`badge ${isPending ? 'badge-warning' : isPreparing ? 'badge-primary' : 'badge-success'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>
                        ${order.totalAmount != null ? order.totalAmount.toFixed(2) : "0.00"}
                      </td>
                      <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Today"}
                      </td>
                      <td>
                        <Link to={`/hotel/orders`} className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}>
                          Manage Order
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
