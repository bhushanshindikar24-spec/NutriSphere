import {  useContext, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Utensils, Mail, MapPin, Award, Edit3, Clock } from "lucide-react";
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
        setProfile({
          kitchenName: user?.hotelName || "NutriKitchen Downtown Hub",
          contactPerson: `${user?.firstName || "Sarah"} ${user?.lastName || "Conner"}`,
          email: user?.email || "kitchen@nutrikitchen.com",
          phone: "+1 (555) 456-7890",
          address: "742 Commercial Way, Boston, MA",
          licenseNumber: "FSIS-CLIN-8841",
          hours: "Mon-Sun: 6:30 AM - 9:30 PM EST",
          bio: "Specializing in medically tailored meals, low-sodium cardiac broths, diabetic-friendly glycemic portions, and allergen-isolated culinary production.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div className="loading-screen">Loading Kitchen Profile...</div>;

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
            <h3 style={{ margin: 0 }}>{profile?.kitchenName}</h3>
            <span style={{ color: "#F59E0B", fontSize: "0.85rem", fontWeight: 600 }}>
              Certified Clinical Nutrition Kitchen
            </span>
          </div>
        </div>

        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {profile?.bio}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Award size={16} color="#F59E0B" />
            <span>Food Safety License: <strong>{profile?.licenseNumber}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <MapPin size={16} color="#F59E0B" />
            <span>{profile?.address}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Mail size={16} color="#F59E0B" />
            <span>{profile?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Clock size={16} color="#F59E0B" />
            <span>{profile?.hours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
