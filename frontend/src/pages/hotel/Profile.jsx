import {  useContext, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Utensils, Mail, MapPin, Award, Edit3, Phone } from "lucide-react";
import api from "../../services/api";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/hotel/profile");
        setProfile(res.data?.data || res.data);
      } catch (_err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div className="loading-screen">Loading Kitchen Profile...</div>;
  if (!profile) return <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Could not load your kitchen profile. Please try again.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Partner Kitchen Profile</h2>
          <p className="text-muted">Commercial food service licensing, clinical food safety, and facility hours.</p>
        </div>
        <button
          onClick={() => navigate("/hotel/profile/edit")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Utensils size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{profile?.hotelName}</h3>
            <span style={{ color: "#F59E0B", fontSize: "0.85rem", fontWeight: 600 }}>
              Certified Clinical Nutrition Kitchen
            </span>
          </div>
        </div>

        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {profile?.description}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Award size={16} color="#F59E0B" />
            <span>Food Safety License: <strong>{profile?.licenseNumber || "Not provided"}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <MapPin size={16} color="#F59E0B" />
            <span>{profile?.hotelAddress || "Address not set"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Mail size={16} color="#F59E0B" />
            <span>{profile?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Phone size={16} color="#F59E0B" />
            <span>{profile?.phoneNumber || "Phone not set"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
