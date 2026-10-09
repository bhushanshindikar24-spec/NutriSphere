import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Users, FileText, Activity, Clock, CheckCircle2, Plus, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";

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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
      <div className="spinner"></div>
      <p style={{ marginLeft: "1rem", color: "var(--text-muted)" }}>Loading Dietitian Workspace...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
            Dietitian Workspace
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
            Welcome back, <strong style={{ color: "var(--text-main)" }}>{stats?.dietitianName || "Clinical Dietitian"}</strong>. Manage patients, formulate clinical nutrition plans, and approve adaptive interventions.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/dietitian/create-plan" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Plus size={18} /> Create Diet Plan
          </Link>
          <Link to="/dietitian/approvals" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Clock size={18} /> Review Approvals ({pendingPlans.length})
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.12)", color: "var(--primary)", padding: "1rem", borderRadius: "14px" }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: "800" }}>{stats?.totalPatients ?? patients.length}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>Assigned Patients</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "rgba(5, 150, 105, 0.12)", color: "#10b981", padding: "1rem", borderRadius: "14px" }}>
            <FileText size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: "800" }}>{stats?.activeDietPlans || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>Active Diet Plans</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.12)", color: "#d97706", padding: "1rem", borderRadius: "14px" }}>
            <Clock size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: "800" }}>{stats?.pendingReviews ?? pendingPlans.length}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>Pending Approvals</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6", padding: "1rem", borderRadius: "14px" }}>
            <Activity size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: "800" }}>{stats?.unreadNotifications || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>Clinical Alerts</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Patients & Pending Plans */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        {/* Assigned Patients Section */}
        <div className="glass-panel" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <UserCheck size={20} color="var(--primary)" /> Assigned Patients ({patients.length})
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Live Roster</span>
          </div>

          {patients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed var(--border-subtle)", borderRadius: "12px" }}>
              <Users size={40} style={{ color: "var(--text-muted)", opacity: 0.5, marginBottom: "0.75rem" }} />
              <p style={{ margin: 0, fontWeight: "600" }}>No patients assigned yet</p>
              <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Patients can select you as their primary dietitian from their HealthyOne portal.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {patients.map((p) => (
                <div key={p.id || p.patientUserId} style={{
                  padding: "1rem 1.25rem",
                  background: "var(--bg-glass-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "1rem", fontWeight: "700" }}>{p.patientName || `Patient #${p.patientUserId}`}</h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {p.patientEmail || "Patient User"} &bull; Assigned: {p.assignedDate || "Active"}
                    </p>
                    {p.notes && <span style={{ fontSize: "0.75rem", color: "var(--primary)", marginTop: "0.2rem", display: "inline-block" }}>{p.notes}</span>}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      to={`/dietitian/create-plan?patientId=${p.patientUserId}`}
                      className="btn-outline"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", textDecoration: "none" }}
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
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={20} color="#d97706" /> Pending Approvals ({pendingPlans.length})
            </h3>
            <Link to="/dietitian/approvals" style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
              View All &rarr;
            </Link>
          </div>

          {pendingPlans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed var(--border-subtle)", borderRadius: "12px" }}>
              <CheckCircle2 size={40} style={{ color: "#10b981", opacity: 0.7, marginBottom: "0.75rem" }} />
              <p style={{ margin: 0, fontWeight: "600" }}>All diet plans reviewed</p>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                No plans currently awaiting dietitian clinical approval.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {pendingPlans.slice(0, 4).map((plan) => (
                <div key={plan.id} style={{
                  padding: "1rem 1.25rem",
                  background: "var(--bg-glass-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem", fontWeight: "700" }}>{plan.title || "Custom Plan"}</h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Patient #{plan.patientUserId} &bull; {plan.targetCalories} kcal &bull; {plan.targetProteinG}g P
                    </p>
                  </div>
                  <button
                    onClick={() => handleApprovePlan(plan.id)}
                    className="btn-primary"
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    <CheckCircle2 size={14} /> Approve
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
