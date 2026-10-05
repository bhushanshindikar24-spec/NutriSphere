import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Calendar, User, ArrowRight } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import Badge from "../../components/common/Badge";
import api from "../../services/api";

export default function DietPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/nutrition/diet-plans");
        setPlans(res.data?.data || res.data || []);
      } catch (_err) {
        setPlans([
          {
            id: 201,
            name: "Phase 2 Mediterranean Fat-Loss",
            patientName: "Alex Morgan",
            patientId: 101,
            dailyCaloriesTarget: 1950,
            dailyProteinTarget: 140,
            status: "ACTIVE",
            startDate: "2026-09-01",
            endDate: "2026-11-30",
          },
          {
            id: 202,
            name: "Low-Glycemic Anti-Inflammatory Plan",
            patientName: "Sarah Jenkins",
            patientId: 102,
            dailyCaloriesTarget: 1750,
            dailyProteinTarget: 110,
            status: "PENDING_APPROVAL",
            startDate: "2026-09-15",
            endDate: "2026-12-15",
          },
          {
            id: 203,
            name: "DASH Cardioprotective Diet",
            patientName: "Robert Chen",
            patientId: 103,
            dailyCaloriesTarget: 2100,
            dailyProteinTarget: 130,
            status: "DRAFT",
            startDate: "2026-10-01",
            endDate: "2026-12-31",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filtered = plans.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const patient = (p.patientName || "").toLowerCase();
    return name.includes(search.toLowerCase()) || patient.includes(search.toLowerCase());
  });

  if (loading) return <div className="loading-screen">Loading Diet Plans...</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Diet Plans</h2>
          <p className="text-muted">Create, approve, and monitor clinical nutritional protocols for your patients.</p>
        </div>
        <button
          onClick={() => navigate("/dietitian/create-plan")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={16} /> Create New Plan
        </button>
      </div>

      <div style={{ position: "relative", maxWidth: "450px" }}>
        <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          type="text"
          className="input-field"
          placeholder="Search plan name or patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "2.5rem", width: "100%" }}
        />
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {filtered.map((plan) => (
          <div
            key={plan.id}
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{plan.name}</h3>
                <Badge variant={plan.status === "ACTIVE" ? "success" : plan.status === "DRAFT" ? "neutral" : "warning"}>
                  {plan.status}
                </Badge>
              </div>

              <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.85rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <User size={14} /> Patient: <strong>{plan.patientName || `#${plan.patientId}`}</strong>
                </span>
                <span>•</span>
                <span>Target: <strong>{plan.dailyCaloriesTarget} kcal</strong></span>
                <span>•</span>
                <span>Protein: <strong>{plan.dailyProteinTarget}g</strong></span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Calendar size={14} /> {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => navigate(`/dietitian/plans/${plan.id}/edit`)}
                className="btn btn-outline"
                style={{ fontSize: "0.85rem" }}
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/dietitian/plans/${plan.id}`)}
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
              >
                View Details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
