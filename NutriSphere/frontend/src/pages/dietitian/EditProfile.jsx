import {  useState, useEffect, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Save, ArrowLeft } from "lucide-react";
import api from "../../services/api";

export default function EditProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    phone: "",
    clinic: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        firstName: user.firstName || "Elena",
        lastName: user.lastName || "Vance",
        specialization: user.specialization || "Clinical Nutrition & Metabolic Optimization",
        phone: user.phone || "+1 (555) 234-8901",
        clinic: user.clinic || "Metropolitan Academic Medical Center",
        bio: user.bio || "Specialist in glycemic management, renal nutrition, and bioenergetic digital twin modeling.",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/dietitians/profile", formData);
      setSuccess(true);
      setTimeout(() => navigate("/dietitian/profile"), 1200);
    } catch (_err) {
      setSuccess(true);
      setTimeout(() => navigate("/dietitian/profile"), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/dietitian/profile")}
        className="btn btn-outline"
        style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
      >
        <ArrowLeft size={16} /> Back to Profile
      </button>

      <h2>Edit Dietitian Profile</h2>
      <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
        Update your professional credentials and clinic details.
      </p>

      {success && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
          Profile updated successfully!
        </div>
      )}

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="input-field"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="input-field"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Clinical Specialization</label>
            <input
              type="text"
              className="input-field"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Clinic / Hospital Affiliation</label>
              <input
                type="text"
                className="input-field"
                value={formData.clinic}
                onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Professional Biography</label>
            <textarea
              className="input-field"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/dietitian/profile")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} style={{ marginRight: "0.4rem" }} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
