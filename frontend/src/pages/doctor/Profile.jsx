import {  useContext, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Mail, Award, Edit3, Phone, Building, Stethoscope, DollarSign } from "lucide-react";
import api from "../../services/api";
import { formatCurrency } from "../../utils/formatters";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctors/profile");
        setProfile(res.data?.data || res.data);
      } catch (_err) {
        setProfile({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          licenseNumber: user?.licenseNumber || "",
          specialization: user?.specialization || "Clinical Medicine",
          hospital: user?.hospital || "",
          hospitalName: user?.hospital || "",
          consultationFee: user?.consultationFee || 0,
          phone: user?.phone || "",
          officeHours: user?.officeHours || "",
          bio: user?.bio || "",
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
          <h2>Physician Profile</h2>
          <p className="text-muted">Medical credentials, state licensing, and institutional affiliations.</p>
        </div>
        <button
          onClick={() => navigate("/doctor/profile/edit")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Stethoscope size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Dr. {profile?.firstName} {profile?.lastName}, MD</h3>
            <span style={{ color: "#10B981", fontSize: "0.85rem", fontWeight: 600 }}>
              {profile?.specialization}
            </span>
          </div>
        </div>

        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {profile?.bio}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Award size={16} color="#10B981" />
            <span>MD License: <strong>{profile?.licenseNumber}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <DollarSign size={16} color="#10B981" />
            <span>Consultation Fee: <strong style={{ color: "#10B981" }}>{formatCurrency(profile?.consultationFee != null ? profile.consultationFee : 800)}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Building size={16} color="#10B981" />
            <span>{profile?.hospitalName || profile?.hospital || "Clinical Practice"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Mail size={16} color="#10B981" />
            <span>{profile?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Phone size={16} color="#10B981" />
            <span>{profile?.phoneNumber || profile?.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
