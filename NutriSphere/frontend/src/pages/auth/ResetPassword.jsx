import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { Lock, CheckCircle, ArrowRight } from "lucide-react";

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
    if (!token) {
      setError("This password reset link is invalid or missing.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
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
      <div className="auth-card" style={{ maxWidth: "460px", width: "100%", margin: "0 auto" }}>
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1.25rem" }}>
            <div style={{
              width: "38px",
              height: "38px",
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              color: "#ffffff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              fontWeight: "800",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.28)"
            }}>
              +
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0284c7", letterSpacing: "-0.02em" }}>
              NutriSphere
            </span>
          </Link>

          <h2 style={{ fontSize: "1.65rem", fontWeight: "800", margin: "0 0 0.4rem 0", color: "#0f172a" }}>
            New Password
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
            Create a secure new password for your clinical account
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: "center", padding: "1.5rem", background: "#ecfdf5", borderRadius: "16px", border: "1px solid #a7f3d0" }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ marginBottom: "0.5rem", color: "#065f46" }}>Password Updated!</h3>
            <p style={{ fontSize: "0.9rem", color: "#047857", marginBottom: "1.5rem" }}>
              Your credentials have been securely reset. Redirecting to login...
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: "inline-block" }}>
              Sign In Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat new password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: "0.85rem", borderRadius: "12px" }}>
              {loading ? "Updating Password..." : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
