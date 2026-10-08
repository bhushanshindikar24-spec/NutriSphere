import { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../../services/authService";
import { UserPlus, MailCheck } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await authService.register(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="glass-panel auth-card" style={{ textAlign: "center" }}>
          <MailCheck size={48} color="var(--primary)" style={{ margin: "0 auto 1rem" }} />
          <h2>Check Your Email</h2>
          <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
            We sent a verification link to <strong>{formData.email}</strong>.
            Your account must be verified before you can sign in.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Continue to Sign In
          </Link>
        </div>
      </div>
    );
  }

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

        {error && (
          <div style={{ color: "#EF4444", textAlign: "center", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

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
            <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} minLength={8} required />
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
