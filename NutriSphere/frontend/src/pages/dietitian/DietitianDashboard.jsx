import { useState, useEffect } from "react";
import api from "../../services/api";
import { Users, FileText, Activity } from "lucide-react";

export default function DietitianDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dietitians/dashboard");
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Dietitian Workspace</h2>
        <p className="text-muted">Manage patients, monitor adherence, and adjust diet plans.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", padding: "1rem", borderRadius: "50%" }}>
            <Users size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", margin: 0 }}>{stats?.activePatientsCount || 0}</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>Active Patients</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--secondary)", padding: "1rem", borderRadius: "50%" }}>
            <FileText size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", margin: 0 }}>{stats?.activeDietPlansCount || 0}</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>Active Diet Plans</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", padding: "1rem", borderRadius: "50%" }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.75rem", margin: 0 }}>{stats?.lowAdherenceCount || 0}</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>Low Adherence Alerts</p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3>Recent Patient Activity</h3>
        <p className="text-muted mt-4">Feature coming soon. Here you will see a list of recent food logs and AI Adaptive Engine recommendations for your patients.</p>
      </div>
    </div>
  );
}
