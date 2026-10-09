import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Users, FileText, Activity, Clock, CheckCircle2, Plus, ArrowRight, UserCheck } from "lucide-react";

export default function DietitianDashboard() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [pendingPlans, setPendingPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, patientsRes, plansRes] = await Promise.allSettled([
        api.get("/dietitians/dashboard"),
        api.get("/dietitians/patients"),
        api.get("/diet-plans/pending")
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.data.success) {
        setStats(statsRes.value.data.data);
      }
      if (patientsRes.status === "fulfilled" && patientsRes.value.data.success) {
        setPatients(patientsRes.value.data.data || []);
      }
      if (plansRes.status === "fulfilled" && plansRes.value.data.success) {
        setPendingPlans(plansRes.value.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching dietitian dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePlan = async (planId) => {
    try {
      await api.put(`/diet-plans/${planId}/approve`);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to approve plan:", err);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px", gap: "0.75rem", color: "#0284c7" }}>
      <div className="spinner" />
      <span style={{ fontWeight: 600 }}>Loading Dietitian Workspace...</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#0f172a", letterSpacing: "-0.02em" }}>
            Dietitian Clinical Workspace
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
            Welcome back, <strong style={{ color: "#0f172a" }}>{stats?.dietitianName || "Clinical Dietitian"}</strong>. Formulate precision nutrition plans, manage patient rosters, and review adaptive changes.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/dietitian/create-plan" className="btn btn-primary" style={{ gap: "0.4rem" }}>
            <Plus size={18} /> Create Diet Plan
          </Link>
          <Link to="/dietitian/approvals" className="btn btn-outline" style={{ gap: "0.4rem" }}>
            <Clock size={18} /> Review Approvals ({pendingPlans.length})
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#e0f2fe", color: "#0284c7", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>{stats?.totalPatients ?? patients.length}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Assigned Patients</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#ecfdf5", color: "#059669", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <FileText size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>{stats?.activeDietPlans || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Active Diet Plans</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#fffbeb", color: "#d97706", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <Clock size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>{stats?.pendingReviews ?? pendingPlans.length}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Pending Approvals</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#f3e8ff", color: "#9333ea", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <Activity size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>{stats?.unreadNotifications || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Clinical Alerts</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Patients & Pending Plans */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem" }}>
        
        {/* Assigned Patients Section */}
        <div className="glass-panel" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <UserCheck size={20} color="#0284c7" /> Assigned Patients ({patients.length})
            </h3>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Live Roster</span>
          </div>

          {patients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e2e8f0", borderRadius: "14px", background: "#f8fafc" }}>
              <Users size={40} style={{ color: "#94a3b8", opacity: 0.6, marginBottom: "0.75rem" }} />
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>No patients assigned yet</p>
              <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "0.85rem", color: "#64748b" }}>
                Patients can select you as their primary dietitian from their NutriSphere portal.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {patients.map((p) => (
                <div key={p.id || p.patientUserId} style={{
                  padding: "1.1rem 1.35rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.02)",
                  transition: "var(--transition)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#bae6fd";
                  e.currentTarget.style.boxShadow = "0 6px 16px -2px rgba(2, 132, 199, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.02)";
                }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                      {p.patientName || `Patient #${p.patientUserId}`}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>
                      {p.patientEmail || "Patient User"} &bull; Assigned: {p.assignedDate || "Active"}
                    </p>
                    {p.notes && <span style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "0.2rem", display: "inline-block", fontWeight: 600 }}>{p.notes}</span>}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      to={`/dietitian/create-plan?patientId=${p.patientUserId}`}
                      className="btn btn-outline"
                      style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem" }}
                    >
                      New Plan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Plan Approvals Section */}
        <div className="glass-panel" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={20} color="#d97706" /> Pending Approvals ({pendingPlans.length})
            </h3>
            <Link to="/dietitian/approvals" style={{ fontSize: "0.85rem", color: "#0284c7", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {pendingPlans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e2e8f0", borderRadius: "14px", background: "#f8fafc" }}>
              <CheckCircle2 size={40} style={{ color: "#10b981", opacity: 0.8, marginBottom: "0.75rem" }} />
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>All diet plans reviewed</p>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                No plans currently awaiting dietitian clinical approval.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {pendingPlans.slice(0, 4).map((plan) => (
                <div key={plan.id} style={{
                  padding: "1.1rem 1.35rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.02)"
                }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{plan.title || "Custom Plan"}</h4>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>
                      Patient #{plan.patientUserId} &bull; {plan.targetCalories} kcal &bull; {plan.targetProteinG}g P
                    </p>
                  </div>
                  <button
                    onClick={() => handleApprovePlan(plan.id)}
                    className="btn btn-primary"
                    style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem", gap: "0.35rem" }}
                  >
                    <CheckCircle2 size={15} /> Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
