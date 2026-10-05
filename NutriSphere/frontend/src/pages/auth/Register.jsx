import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../../services/authService";
import { UserPlus } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "PATIENT"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await authService.register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="text-center mb-6">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "1rem", borderRadius: "50%", color: "var(--primary)" }}>
              <UserPlus size={32} />
            </div>
          </div>
          <h2>Create Account</h2>
          <p className="text-muted">Join the NutriSphere platform</p>
        </div>

        {error && <div style={{ color: "red", textAlign: "center", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-input" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-input" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="DIETITIAN">Dietitian</option>
              <option value="HOTEL">Hotel</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
        
        <p className="text-center text-muted mt-4">
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
