import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState(token ? "verifying" : "error");
  const [errorMsg, setErrorMsg] = useState(token ? "" : "Missing email verification token.");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const verify = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        if (!cancelled) setStatus("success");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(err?.response?.data?.message || "Verification link is invalid or expired.");
        }
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center", padding: "2.5rem", maxWidth: "460px", width: "100%", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
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
        </div>

        {status === "verifying" && (
          <div>
            <Loader2 size={48} className="spinner" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>Verifying Email</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Please wait while we confirm your clinical credentials...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle size={48} color="#10b981" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#065f46" }}>Email Verified!</h3>
            <p style={{ color: "#047857", marginBottom: "1.5rem", fontSize: "0.9rem", lineHeight: 1.5 }}>
              Your email has been verified successfully. You can now access all NutriSphere features.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Continue to Sign In
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <XCircle size={48} color="#ef4444" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#991b1b" }}>Verification Failed</h3>
            <p style={{ color: "#ef4444", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{errorMsg}</p>
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
