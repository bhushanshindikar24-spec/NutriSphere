import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  User, 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Edit3, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { changePassword } from "../../services/userService";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Notification Preferences state
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    waterReminders: true,
    careTeamUpdates: true,
    labResults: true,
  });
  const [savedNotifs, setSavedNotifs] = useState(false);

  // Unit Preferences
  const [unitSystem, setUnitSystem] = useState("metric");

  const getProfilePath = () => {
    switch (user?.role) {
      case "DOCTOR":
        return "/doctor/profile";
      case "DIETITIAN":
        return "/dietitian/profile";
      case "PATIENT":
      default:
        return "/patient/profile";
    }
  };

  const getEditProfilePath = () => {
    switch (user?.role) {
      case "DOCTOR":
        return "/doctor/profile/edit";
      case "DIETITIAN":
        return "/dietitian/profile/edit";
      case "PATIENT":
      default:
        return "/patient/profile/edit";
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    try {
      setPwLoading(true);
      await changePassword({ currentPassword, newPassword });
      setPwSuccess("Password successfully updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err.response?.data?.message || err.message || "Failed to update password. Verify current password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedNotifs(true);
    setTimeout(() => setSavedNotifs(false), 3000);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      {/* Page Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            background: "rgba(2, 132, 199, 0.12)",
            padding: "0.6rem",
            borderRadius: "12px",
            color: "#0284c7"
          }}>
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, color: "#0f172a" }}>
              Account & Clinical Settings
            </h2>
            <p className="text-muted" style={{ margin: "0.3rem 0 0 0", fontSize: "0.9rem" }}>
              Manage your personal credentials, profile information, and clinical preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)"
            }}>
              {user?.firstName ? user.firstName.charAt(0) : "U"}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                  {user?.firstName} {user?.lastName}
                </h3>
                <span style={{
                  background: "#f0f9ff",
                  color: "#0284c7",
                  border: "1px solid rgba(2, 132, 199, 0.2)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  fontSize: "0.72rem",
                  fontWeight: 700
                }}>
                  {user?.role}
                </span>
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate(getProfilePath())}
              style={{
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#334155",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <User size={16} />
              View Full Profile
            </button>
            <button
              onClick={() => navigate(getEditProfilePath())}
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                border: "none",
                padding: "0.6rem 1.15rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)"
              }}
            >
              <Edit3 size={16} />
              Edit Profile & Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
          <Lock size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a" }}>
            Security & Change Password
          </h3>
        </div>
        <p className="text-muted" style={{ margin: "0 0 1.5rem 0", fontSize: "0.85rem" }}>
          Ensure your clinical account stays secure by using a strong password with at least 8 characters.
        </p>

        {pwSuccess && (
          <div style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.875rem"
          }}>
            <CheckCircle2 size={18} color="#059669" />
            <span>{pwSuccess}</span>
          </div>
        )}

        {pwError && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.875rem"
          }}>
            <AlertCircle size={18} color="#dc2626" />
            <span>{pwError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: "grid", gap: "1.2rem", maxWidth: "540px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
              Current Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={{
                  width: "100%",
                  padding: "0.65rem 2.5rem 0.65rem 0.85rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  boxSizing: "border-box"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
              New Password (minimum 8 characters)
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "0.9rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "0.9rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={pwLoading}
              style={{
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                padding: "0.7rem 1.4rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: pwLoading ? "not-allowed" : "pointer",
                opacity: pwLoading ? 0.7 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <ShieldCheck size={16} />
              {pwLoading ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Bell size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a" }}>
              Notification Preferences
            </h3>
          </div>
          {savedNotifs && (
            <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>
              Preferences saved!
            </span>
          )}
        </div>
        <p className="text-muted" style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem" }}>
          Configure alerts and clinical reminders sent to your dashboard and email.
        </p>

        <div style={{ display: "grid", gap: "1rem" }}>
          {[
            { key: "mealReminders", label: "Daily Meal Logging Reminders", desc: "Timely alerts to record breakfast, lunch, and dinner" },
            { key: "waterReminders", label: "Hydration Milestone Alerts", desc: "Reminders to achieve your personalized 2.3L target" },
            { key: "careTeamUpdates", label: "Diet Plan Adjustments", desc: "Notifications when your Dietitian updates your macro targets" },
            { key: "labResults", label: "Diagnostic Lab Reports & AI Alerts", desc: "Instant updates when new lab analyses or flags are ready" }
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleNotificationToggle(item.key)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid #f1f5f9",
                background: "#f8fafc",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1e293b" }}>{item.label}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{item.desc}</div>
              </div>
              <div style={{
                width: "44px",
                height: "24px",
                borderRadius: "9999px",
                background: notifications[item.key] ? "#0284c7" : "#cbd5e1",
                position: "relative",
                transition: "background 0.2s"
              }}>
                <div style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  position: "absolute",
                  top: "3px",
                  left: notifications[item.key] ? "23px" : "3px",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Units */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.15rem", color: "#0f172a" }}>
          Clinical Units & Standards
        </h3>
        <p className="text-muted" style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem" }}>
          Choose your preferred unit system for weight, height, and caloric measurements.
        </p>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => setUnitSystem("metric")}
            style={{
              flex: 1,
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              border: unitSystem === "metric" ? "2px solid #0284c7" : "1px solid #cbd5e1",
              background: unitSystem === "metric" ? "#f0f9ff" : "#ffffff",
              color: unitSystem === "metric" ? "#0284c7" : "#475569",
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div>Metric (kg, cm, Liters)</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b", marginTop: "0.2rem" }}>
              Standard WHO & Indian clinical guidelines
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUnitSystem("imperial")}
            style={{
              flex: 1,
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              border: unitSystem === "imperial" ? "2px solid #0284c7" : "1px solid #cbd5e1",
              background: unitSystem === "imperial" ? "#f0f9ff" : "#ffffff",
              color: unitSystem === "imperial" ? "#0284c7" : "#475569",
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div>Imperial (lbs, inches, fl oz)</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b", marginTop: "0.2rem" }}>
              US customary clinical units
            </div>
          </button>
        </div>
      </div>

      {/* Logout Action Card */}
      <div style={{
        background: "#fff",
        border: "1px solid #fee2e2",
        borderRadius: "16px",
        padding: "1.5rem 1.75rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <div style={{ fontWeight: 700, color: "#991b1b", fontSize: "1rem" }}>Sign Out of Session</div>
          <div style={{ color: "#7f1d1d", fontSize: "0.82rem", marginTop: "0.15rem" }}>
            Safely disconnect your session and clear local access tokens on this device.
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{
            background: "#ef4444",
            color: "#ffffff",
            border: "none",
            padding: "0.6rem 1.25rem",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)"
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
