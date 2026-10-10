import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, Stethoscope, Apple, Utensils, CheckCircle, Clock, ArrowRight } from "lucide-react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    activeDoctors: 0,
    activeDietitians: 0,
    activePatients: 0,
    activeKitchens: 0,
  });
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, pendingRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/pending-verifications"),
        ]);
        setStats(statsRes.data?.data || statsRes.data || {});
        setPendingList(pendingRes.data?.data || pendingRes.data || []);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px", gap: "0.75rem", color: "#0284c7" }}>
      <div className="spinner" />
      <span style={{ fontWeight: 600 }}>Loading Governance Console...</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
          <div style={{ background: "#e0f2fe", padding: "0.6rem", borderRadius: "12px", color: "#0284c7", display: "flex" }}>
            <ShieldCheck size={26} />
          </div>
          <h1 style={{ margin: 0, fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            System Administration & Governance
          </h1>
        </div>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Supervise clinical professionals, verify medical credentials, audit registered user accounts, and maintain platform security.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.25rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px", border: "1.5px solid #fde68a", background: "#fffdf5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#b45309", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Pending Licenses</span>
            <div style={{ background: "#fef3c7", padding: "0.4rem", borderRadius: "8px", color: "#d97706", display: "flex" }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#b45309" }}>{stats.pendingVerifications}</div>
          <div style={{ fontSize: "0.8rem", color: "#92400e", marginTop: "0.2rem", fontWeight: 500 }}>Requires verification action</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Active Doctors</span>
            <div style={{ background: "#e0f2fe", padding: "0.4rem", borderRadius: "8px", color: "#0284c7", display: "flex" }}>
              <Stethoscope size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a" }}>{stats.activeDoctors}</div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>Verified Physicians</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Active Dietitians</span>
            <div style={{ background: "#ecfdf5", padding: "0.4rem", borderRadius: "8px", color: "#10b981", display: "flex" }}>
              <Apple size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a" }}>{stats.activeDietitians}</div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>Registered Dietitians (RD)</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Active Patients</span>
            <div style={{ background: "#f0f9ff", padding: "0.4rem", borderRadius: "8px", color: "#0ea5e9", display: "flex" }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a" }}>{stats.activePatients}</div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>Enrolled Care Patients</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Kitchens</span>
            <div style={{ background: "#fff1f2", padding: "0.4rem", borderRadius: "8px", color: "#f43f5e", display: "flex" }}>
              <Utensils size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a" }}>{stats.activeKitchens}</div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>Therapeutic Meal Kitchens</div>
        </div>
      </div>

      {/* Action Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>Pending Professional Licenses</h3>
            <Link to="/admin/verifications" className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "0.4rem 0.8rem" }}>
              View Queue ({pendingList.length})
            </Link>
          </div>
          {pendingList.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: "0.9rem", padding: "2rem 0", textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #e2e8f0" }}>
              <CheckCircle size={36} color="#10b981" style={{ marginBottom: "0.5rem", opacity: 0.9 }} />
              <div style={{ fontWeight: 600, color: "#0f172a" }}>All credentials up to date</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.2rem" }}>No professional licenses currently awaiting administrative action.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {pendingList.slice(0, 3).map((item) => (
                <div key={item.userId} style={{ background: "#ffffff", padding: "0.85rem 1.1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>{item.fullName}</div>
                    <div style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>
                      {item.role} &bull; License: {item.licenseNumber || "Attached"}
                    </div>
                  </div>
                  <Link to="/admin/verifications" className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.85rem" }}>
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>Directory & User Governance</h3>
            <Link to="/admin/users" className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "0.4rem 0.8rem" }}>
              All Users ({stats.totalUsers})
            </Link>
          </div>
          <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6 }}>
            Audit all registered user accounts, manage permission roles, and review authentication logs. All operations performed here comply with HIPAA and clinical data governance standards.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
            <Link to="/admin/verifications" className="btn btn-primary" style={{ gap: "0.4rem" }}>
              Verify Licenses <ArrowRight size={16} />
            </Link>
            <Link to="/admin/users" className="btn btn-outline">
              User Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
