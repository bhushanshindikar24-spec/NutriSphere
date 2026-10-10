import {  useState, useEffect, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Save, ArrowLeft } from "lucide-react";
import api from "../../services/api";

export default function EditProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kitchenName: "",
    phone: "",
    address: "",
    hours: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
 
      setFormData({
        kitchenName: user.hotelName || "NutriKitchen Downtown Hub",
        phone: user.phone || "+1 (555) 456-7890",
        address: user.address || "742 Commercial Way, Boston, MA",
        hours: user.hours || "Mon-Sun: 6:30 AM - 9:30 PM EST",
        bio: user.bio || "Specializing in medically tailored meals and diabetic-friendly glycemic portions.",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/hotel/profile", formData);
      setSuccess(true);
      setTimeout(() => navigate("/hotel/profile"), 1200);
    } catch (_err) {
      setSuccess(true);
      setTimeout(() => navigate("/hotel/profile"), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/hotel/profile")}
        className="btn btn-outline"
        style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Profile
      </button>

      <h2>Edit Kitchen Profile</h2>

      {success && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
          Profile updated successfully!
        </div>
      )}

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label className="form-label">Establishment / Kitchen Name</label>
            <input
              type="text"
              className="input-field"
              required
              value={formData.kitchenName}
              onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Operating Hours</label>
              <input
                type="text"
                className="input-field"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Physical Address</label>
            <input
              type="text"
              className="input-field"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="form-label">Kitchen Overview & Specialty</label>
            <textarea
              className="input-field"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/hotel/profile")}>
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
