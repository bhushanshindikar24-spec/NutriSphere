import {  useEffect, useState  } from "react";
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
      <div className="glass-panel auth-card" style={{ textAlign: "center", padding: "2rem" }}>
        {status === "verifying" && (
          <div>
            <Loader2 size={48} className="animate-spin" color="var(--primary)" style={{ margin: "0 auto 1rem" }} />
            <h3>Verifying Email</h3>
            <p className="text-muted">Please wait while we confirm your account...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle size={48} color="#10B981" style={{ margin: "0 auto 1rem" }} />
            <h3>Email Verified!</h3>
            <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
              Your email has been verified successfully. You can now access all NutriSphere features.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Continue to Sign In
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <XCircle size={48} color="#EF4444" style={{ margin: "0 auto 1rem" }} />
            <h3>Verification Failed</h3>
            <p style={{ color: "#EF4444", marginBottom: "1.5rem" }}>{errorMsg}</p>
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
