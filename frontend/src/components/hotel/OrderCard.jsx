
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

export default function OrderCard({ order, onUpdateStatus, isHotelOwner = false }) {
  if (!order) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: "1rem" }}>Order #{order.id}</span>
          <p className="text-muted" style={{ margin: "0.15rem 0 0", fontSize: "0.75rem" }}>
            {order.createdAt ? formatDateTime(order.createdAt) : "Recent"}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "0.75rem 0", margin: "0.75rem 0" }}>
        {order.items?.map((item, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
            <span>{item.quantity}x {item.mealName || "Meal Item"}</span>
            <span style={{ fontWeight: 500 }}>{formatCurrency((item.unitPrice || 0) * (item.quantity || 1))}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: "0.5rem", fontSize: "0.9375rem" }}>
          <span>Total:</span>
          <span>{formatCurrency(order.totalAmount || 0)}</span>
        </div>
      </div>

      {isHotelOwner && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
          {order.status === "PENDING" && (
            <button
              onClick={() => onUpdateStatus(order.id, "PREPARING")}
              className="btn btn-primary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
            >
              Start Preparing
            </button>
          )}
          {order.status === "PREPARING" && (
            <button
              onClick={() => onUpdateStatus(order.id, "OUT_FOR_DELIVERY")}
              className="btn btn-primary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
            >
              Dispatch Delivery
            </button>
          )}
          {order.status === "OUT_FOR_DELIVERY" && (
            <button
              onClick={() => onUpdateStatus(order.id, "DELIVERED")}
              className="btn btn-primary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", background: "#10B981" }}
            >
              Mark Delivered
            </button>
          )}
          <button
            onClick={() => onUpdateStatus(order.id, "CANCELLED")}
            className="btn btn-outline"
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", color: "#EF4444" }}
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
