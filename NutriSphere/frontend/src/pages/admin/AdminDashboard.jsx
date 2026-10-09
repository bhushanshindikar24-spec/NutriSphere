import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, Stethoscope, Apple, Utensils, CheckCircle, Clock } from "lucide-react";
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

  if (loading) return <div className="loading-screen">Loading System Governance Panel...</div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "var(--accent)" }}>
            <ShieldAlert size={24} />
          </div>
          <h2 style={{ margin: 0 }}>System Administration & Governance Console</h2>
        </div>
        <p className="text-muted" style={{ margin: 0 }}>
          Manage clinical professionals, verify medical, dietetic and culinary operating licenses, and audit system health.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>PENDING LICENSES</span>
            <Clock size={20} color="var(--accent)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)" }}>{stats.pendingVerifications}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Requires Administrator Action</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE DOCTORS</span>
            <Stethoscope size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats.activeDoctors}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Verified Medical Practitioners</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE DIETITIANS</span>
            <Apple size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats.activeDietitians}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Clinical Nutrition Supervisors</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE PATIENTS</span>
            <Users size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats.activePatients}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Enrolled in Nutrition Care</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>CULINARY KITCHENS</span>
            <Utensils size={20} color="#f43f5e" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats.activeKitchens}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Licensed Kitchen Partners</div>
        </div>
      </div>

      {/* Action Banners */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Pending Professional Licenses</h3>
            <Link to="/admin/verifications" className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
              View Queue ({pendingList.length})
            </Link>
          </div>
          {pendingList.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "1.5rem 0", textAlign: "center" }}>
              <CheckCircle size={32} color="var(--primary)" style={{ marginBottom: "0.5rem", opacity: 0.8 }} />
              <div>All professional applications and licenses are verified and up to date!</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {pendingList.slice(0, 3).map((item) => (
                <div key={item.userId} style={{ background: "rgba(255, 255, 255, 0.02)", padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item.fullName}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
                      {item.role} • License: {item.licenseNumber || "Attached"}
                    </div>
                  </div>
                  <Link to="/admin/verifications" className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem" }}>
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem" }}>User Governance</h3>
            <Link to="/admin/users" className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
              All Users ({stats.totalUsers})
            </Link>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Audit all registered user accounts, manage roles, and review security access. All actions performed here are logged in the immutable audit repository.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
            <Link to="/admin/verifications" className="btn btn-primary">
              Verify Clinical Licenses
            </Link>
            <Link to="/admin/users" className="btn btn-outline">
              Manage Users Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
