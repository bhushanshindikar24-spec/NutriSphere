import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Users, Stethoscope, UserCheck, Clock, ArrowRight, Bell } from "lucide-react";

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDoctorData();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px", gap: "0.75rem", color: "#0284c7" }}>
      <div className="spinner" />
      <span style={{ fontWeight: 600 }}>Loading Physician Portal...</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#0f172a", letterSpacing: "-0.02em" }}>
            Doctor Clinical Portal
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
            Welcome back, <strong style={{ color: "#0f172a" }}>Dr. {stats?.doctorName || "Physician"}</strong>. Monitor patient biomarkers, review metabolic adherence, and oversee dietary care.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/doctor/consultations" className="btn btn-primary" style={{ gap: "0.5rem" }}>
            <Stethoscope size={18} /> Consultations
          </Link>
          <Link to="/doctor/patients" className="btn btn-outline" style={{ gap: "0.5rem" }}>
            <Users size={18} /> Patient Roster
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
            <Stethoscope size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>{stats?.consultationsToday || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Today's Consultations</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#fffbeb", color: "#d97706", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <Clock size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>{stats?.pendingReports || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Medical Records</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#f3e8ff", color: "#9333ea", padding: "1rem", borderRadius: "14px", display: "flex" }}>
            <Bell size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.85rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>{stats?.unreadNotifications || 0}</h3>
            <p style={{ margin: "0.2rem 0 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>System Alerts</p>
          </div>
        </div>
      </div>

      {/* Patients Roster Section */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserCheck size={20} color="#0284c7" /> Clinical Patients ({patients.length})
          </h3>
          <Link to="/doctor/patients" style={{ fontSize: "0.85rem", color: "#0284c7", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Manage Roster <ArrowRight size={14} />
          </Link>
        </div>

        {patients.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e2e8f0", borderRadius: "14px", background: "#f8fafc" }}>
            <Users size={40} style={{ color: "#94a3b8", opacity: 0.6, marginBottom: "0.75rem" }} />
            <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>No patients currently assigned</p>
            <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "0.85rem", color: "#64748b" }}>
              Patients can select you as their physician from their NutriSphere portal or you can admit a patient.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {patients.map((p) => (
              <div key={p.id || p.patientUserId} style={{
                padding: "1.35rem",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                transition: "var(--transition)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#bae6fd";
                e.currentTarget.style.boxShadow = "0 8px 20px -2px rgba(2, 132, 199, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.03)";
              }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                      {p.patientName || `Patient #${p.patientUserId}`}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>{p.patientEmail || "Patient User"}</p>
                  </div>
                  <span className="badge badge-success">
                    Active
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                  Assigned Date: <strong style={{ color: "#0f172a" }}>{p.assignedDate || "Active"}</strong>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                  <Link
                    to={`/doctor/consultations?patientId=${p.patientUserId}`}
                    className="btn btn-outline"
                    style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem", flex: 1, textAlign: "center" }}
                  >
                    Clinical Notes
                  </Link>
                  <Link
                    to={`/doctor/assign-dietitian?patientId=${p.patientUserId}`}
                    className="btn btn-primary"
                    style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem", flex: 1, textAlign: "center" }}
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
