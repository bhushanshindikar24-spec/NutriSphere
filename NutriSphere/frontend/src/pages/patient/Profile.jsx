import {  useContext, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Edit3 } from "lucide-react";
import api from "../../services/api";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/patient/profile");
        setProfileData(res.data?.data || res.data);
      } catch (_err) {
        setProfileData({
          firstName: user?.firstName || "Alex",
          lastName: user?.lastName || "Morgan",
          email: user?.email || "patient@nutrisphere.health",
          dateOfBirth: "1994-06-15",
          gender: "Male",
          heightCm: 178,
          weightKg: 78.5,
          bloodGroup: "O+",
          activityLevel: "MODERATE",
          allergies: ["Peanuts", "Shellfish"],
          chronicConditions: ["Mild Dyslipidemia"],
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
          <h2>Patient Profile</h2>
          <p className="text-muted">Manage your clinical biometrics, health conditions, and personal settings.</p>
        </div>
        <button
          onClick={() => navigate("/patient/profile/edit")}
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
            <h3 style={{ margin: 0 }}>{profileData?.firstName} {profileData?.lastName}</h3>
            <span className="text-muted" style={{ fontSize: "0.85rem" }}>{profileData?.email}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Date of Birth</span>
            <strong>{profileData?.dateOfBirth || "--"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Biological Sex</span>
            <strong>{profileData?.gender || "--"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Height</span>
            <strong>{profileData?.heightCm ? `${profileData.heightCm} cm` : "--"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Current Weight</span>
            <strong>{profileData?.weightKg ? `${profileData.weightKg} kg` : "--"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Blood Group</span>
            <strong>{profileData?.bloodGroup || "--"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Physical Activity</span>
            <strong>{profileData?.activityLevel || "MODERATE"}</strong>
          </div>
        </div>

        {/* Known Allergies & Clinical History */}
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Clinical Considerations & Allergies</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {(profileData?.allergies || []).map((a, i) => (
              <span key={i} className="badge badge-warning" style={{ fontSize: "0.8rem" }}>
                Allergy: {a}
              </span>
            ))}
            {(profileData?.chronicConditions || []).map((c, i) => (
              <span key={i} className="badge badge-primary" style={{ fontSize: "0.8rem" }}>
                Condition: {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
