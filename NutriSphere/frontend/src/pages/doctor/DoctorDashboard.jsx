import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Users, Stethoscope, FilePlus, Activity, ShieldCheck, UserCheck, Plus, Clock } from "lucide-react";

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [statsRes, patientsRes] = await Promise.allSettled([
        api.get("/doctors/dashboard"),
        api.get("/doctors/patients")
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.data.success) {
        setStats(statsRes.value.data.data);
      }
      if (patientsRes.status === "fulfilled" && patientsRes.value.data.success) {
        setPatients(patientsRes.value.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching doctor dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
      <div className="spinner"></div>
      <p style={{ marginLeft: "1rem", color: "var(--text-muted)" }}>Loading Doctor Portal...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
            Doctor Clinical Portal
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
            Welcome back, <strong style={{ color: "var(--text-main)" }}>Dr. {stats?.doctorName || "Physician"}</strong>. Monitor patient biomarkers, review metabolic adherence, and oversee dietary care.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/doctor/consultations" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Stethoscope size={18} /> Consultations
          </Link>
          <Link to="/doctor/patients" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Users size={18} /> Patient Roster
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
            <Stethoscope size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: "800" }}>{stats?.consultationsToday || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>Today's Consultations</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.12)", color: "#d97706", padding: "1rem", borderRadius: "14px" }}>
            <Clock size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: "800" }}>{stats?.pendingReports || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>Medical Records</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6", padding: "1rem", borderRadius: "14px" }}>
            <Activity size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: "800" }}>{stats?.unreadNotifications || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>System Alerts</p>
          </div>
        </div>
      </div>

      {/* Patients Roster Section */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserCheck size={20} color="var(--primary)" /> Clinical Patients ({patients.length})
          </h3>
          <Link to="/doctor/patients" style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
            Manage Roster &rarr;
          </Link>
        </div>

        {patients.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed var(--border-subtle)", borderRadius: "12px" }}>
            <Users size={40} style={{ color: "var(--text-muted)", opacity: 0.5, marginBottom: "0.75rem" }} />
            <p style={{ margin: 0, fontWeight: "600" }}>No patients currently assigned</p>
            <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Patients can select you as their physician from their HealthyOne portal or you can admit a patient.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
            {patients.map((p) => (
              <div key={p.id || p.patientUserId} style={{
                padding: "1.25rem",
                background: "var(--bg-glass-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "1.05rem", fontWeight: "700" }}>{p.patientName || `Patient #${p.patientUserId}`}</h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.patientEmail || "Patient User"}</p>
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.1)", color: "var(--primary)", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: "600" }}>
                    Active
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Assigned Date: <strong>{p.assignedDate || "Active"}</strong>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                  <Link
                    to={`/doctor/consultations?patientId=${p.patientUserId}`}
                    className="btn-outline"
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", flex: 1, textAlign: "center", textDecoration: "none" }}
                  >
                    Clinical Notes
                  </Link>
                  <Link
                    to={`/doctor/assign-dietitian?patientId=${p.patientUserId}`}
                    className="btn-primary"
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", flex: 1, textAlign: "center", textDecoration: "none" }}
                  >
                    Assign Dietitian
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
