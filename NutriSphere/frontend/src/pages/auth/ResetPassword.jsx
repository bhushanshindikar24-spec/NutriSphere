import {  useState  } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Lock, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || "Password reset failed. Token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="text-center mb-6">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "1rem", borderRadius: "50%", color: "var(--primary)" }}>
              <Lock size={32} />
            </div>
          </div>
          <h2>New Password</h2>
          <p className="text-muted">Create a secure new password for your account</p>
        </div>

        {error && (
          <div style={{ color: "#EF4444", textAlign: "center", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <CheckCircle size={48} color="#10B981" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>Password Updated!</h3>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
