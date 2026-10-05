import {  useContext, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Mail, Award, Edit3, Phone, Building } from "lucide-react";
import api from "../../services/api";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/dietitians/profile");
        setProfile(res.data?.data || res.data);
      } catch (_err) {
        setProfile({
          firstName: user?.firstName || "Elena",
          lastName: user?.lastName || "Vance",
          email: user?.email || "dietitian@nutrisphere.health",
          licenseNumber: "RD-98214-MET",
          specialization: "Clinical Nutrition & Metabolic Optimization",
          phone: "+1 (555) 234-8901",
          clinic: "Metropolitan Academic Medical Center",
          bio: "Specialist in glycemic management, renal nutrition, and bioenergetic digital twin modeling with 12+ years of clinical practice.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div className="loading-screen">Loading Profile...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Dietitian Profile</h2>
          <p className="text-muted">Clinical credentials, licensing, and professional details.</p>
        </div>
        <button
          onClick={() => navigate("/dietitian/profile/edit")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Dr. {profile?.firstName} {profile?.lastName}, RD</h3>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
              {profile?.specialization}
            </span>
          </div>
        </div>

        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {profile?.bio}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Award size={16} color="var(--primary)" />
            <span>License: <strong>{profile?.licenseNumber}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Building size={16} color="var(--primary)" />
            <span>{profile?.clinic}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Mail size={16} color="var(--primary)" />
            <span>{profile?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Phone size={16} color="var(--primary)" />
            <span>{profile?.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
