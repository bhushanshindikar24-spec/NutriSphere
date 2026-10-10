
import Badge from "../common/Badge";
import { Calendar, CheckCircle } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function DietPlanCard({ plan, onView, onApprove, isDietitian = false }) {
  if (!plan) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "1.125rem" }}>{plan.name || "Personalized Diet Plan"}</h4>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
            <Calendar size={12} /> {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
          </span>
        </div>
        <Badge variant={plan.status}>{plan.status}</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", margin: "1rem 0", background: "var(--bg-color)", padding: "0.75rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
        <div>
          <span className="text-muted" style={{ fontSize: "0.7rem" }}>Daily Calories</span>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem" }}>{plan.targetCalories || "--"} kcal</p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.7rem" }}>Protein</span>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem" }}>{plan.targetProteinG || "--"}g</p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.7rem" }}>Meals Planned</span>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem" }}>{plan.meals?.length || 0}</p>
        </div>
      </div>

      {plan.notes && (
        <p className="text-muted" style={{ fontSize: "0.8125rem", lineHeight: 1.4, marginBottom: "1rem" }}>
          {plan.notes}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        {onView && (
          <button
            onClick={() => onView(plan)}
            className="btn btn-outline"
            style={{ flex: 1, fontSize: "0.8125rem" }}
          >
            View Details
          </button>
        )}
        {isDietitian && plan.status === "PENDING_APPROVAL" && onApprove && (
          <button
            onClick={() => onApprove(plan.id)}
            className="btn btn-primary"
            style={{ flex: 1, fontSize: "0.8125rem" }}
          >
            <CheckCircle size={14} /> Approve Plan
          </button>
        )}
      </div>
    </div>
  );
}
