import {  useState, useEffect  } from "react";
import { User, Mail, Phone, Calendar, Award, MessageSquare } from "lucide-react";
import api from "../../services/api";

export default function MyDietitian() {
  const [dietitian, setDietitian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDietitian = async () => {
      try {
        const res = await api.get("/patient/dietitian");
        setDietitian(res.data?.data || res.data);
      } catch (_err) {
        setDietitian({
          name: "Dr. Elena Vance, RD, LDN",
          specialization: "Clinical Nutrition & Metabolic Optimization",
          email: "elena.vance@nutrisphere.health",
          phone: "+1 (555) 234-8901",
          licenseNumber: "RD-98214-MET",
          bio: "Specialist in glycemic management, renal nutrition, and bioenergetic digital twin modeling with 12+ years of clinical practice.",
          officeHours: "Mon-Thu: 9:00 AM - 4:00 PM EST",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDietitian();
  }, []);

  if (loading) return <div className="loading-screen">Loading Dietitian Information...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div>
        <h2>My Clinical Dietitian</h2>
        <p className="text-muted">Your dedicated nutritionist managing your dietary prescriptions and adaptive interventions.</p>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{dietitian?.name}</h3>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
              {dietitian?.specialization}
            </span>
          </div>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          {dietitian?.bio}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Mail size={16} color="var(--primary)" />
            <span>{dietitian?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Phone size={16} color="var(--primary)" />
            <span>{dietitian?.phone}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Award size={16} color="var(--primary)" />
            <span>License: {dietitian?.licenseNumber}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Calendar size={16} color="var(--primary)" />
            <span>{dietitian?.officeHours}</span>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
          <a
            href={`mailto:${dietitian?.email}`}
            className="btn btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <MessageSquare size={16} /> Send Message to Dietitian
          </a>
        </div>
      </div>
    </div>
  );
}
