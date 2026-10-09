import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Stethoscope, Apple, Utensils, User, ShieldCheck, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import * as authService from "../../services/authService";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("PATIENT");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    licenseNumber: "",
    degree: "",
    specialization: "",
    achievements: "",
    hospitalOrClinic: "",
    licenseDocumentUrl: "",
    yearsExperience: 5,
    consultationFee: 75,
    cuisineType: "Clinical & Therapeutic",
    address: "",
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/files/upload-license", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileUrl = res.data?.data?.downloadUrl || `/api/files/download/${res.data?.data?.id}`;
      setFormData((prev) => ({ ...prev, licenseDocumentUrl: fileUrl }));
      setUploadedFileName(file.name);
    } catch (err) {
      console.error("License upload error", err);
      setError("Failed to upload license document. You can continue or try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        role: selectedRole,
        yearsExperience: Number(formData.yearsExperience) || 0,
        consultationFee: Number(formData.consultationFee) || 0,
      };

      const res = await authService.register(payload);
      if (selectedRole === "PATIENT") {
        setSuccessInfo({
          title: "Registration Complete!",
          message: "Your patient account is active. Redirecting to login...",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setSuccessInfo({
          title: "Application Submitted for Review",
          message: res?.message ||
            "Your credentials and license have been submitted. An administrator will verify your license before activating your account.",
        });
      }
    } catch (err) {
      console.error("Registration error", err);
      setError(err.response?.data?.message || "Failed to complete registration. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "2rem 1rem" }}>
      <div className="glass-panel auth-card" style={{ maxWidth: selectedRole === "PATIENT" ? "480px" : "680px", width: "100%", margin: "0 auto", padding: "2.5rem" }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "1rem", borderRadius: "50%", color: "var(--primary)" }}>
              <UserPlus size={32} />
            </div>
          </div>
          <h2 style={{ margin: "0 0 0.5rem 0" }}>Join HealthyOne / NutriSphere</h2>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            Clinical Nutrition & Dietary Intelligence Ecosystem
          </p>
        </div>

        {/* Role Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1.75rem", background: "rgba(255, 255, 255, 0.03)", padding: "0.4rem", borderRadius: "10px" }}>
          {[
            { id: "PATIENT", label: "Patient", icon: <User size={15} /> },
            { id: "DOCTOR", label: "Doctor", icon: <Stethoscope size={15} /> },
            { id: "DIETITIAN", label: "Dietitian", icon: <Apple size={15} /> },
            { id: "HOTEL", label: "Kitchen", icon: <Utensils size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setSelectedRole(tab.id); setError(""); }}
              style={{
                background: selectedRole === tab.id ? "var(--primary)" : "transparent",
                color: selectedRole === tab.id ? "#0f172a" : "var(--text-muted)",
                fontWeight: selectedRole === tab.id ? 700 : 500,
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 0.2rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.75rem",
                transition: "all 0.2s ease",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Verification Notice for Professionals */}
        {selectedRole !== "PATIENT" && (
          <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", padding: "0.85rem 1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.82rem", color: "var(--accent)", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
            <div>
              <strong>License Verification Required:</strong> Clinical practitioners and culinary partners must upload their operating license. An administrator will review and approve your credentials before granting access.
            </div>
          </div>
        )}

        {/* Success Modal/Notice */}
        {successInfo ? (
          <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1.5rem", borderRadius: "10px", textAlign: "center" }}>
            <CheckCircle2 size={44} color="var(--primary)" style={{ marginBottom: "0.75rem" }} />
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#fff" }}>{successInfo.title}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
              {successInfo.message}
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: "inline-block" }}>
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Basic Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>First Name *</label>
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
                <label className="form-label" style={{ fontSize: "0.85rem" }}>Last Name *</label>
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

            <div style={{ display: "grid", gridTemplateColumns: selectedRole === "PATIENT" ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>Email Address *</label>
                <input
                  type="email"
                  className="input-field"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>
              {selectedRole !== "PATIENT" && (
                <div>
                  <label className="form-label" style={{ fontSize: "0.85rem" }}>Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="form-label" style={{ fontSize: "0.85rem" }}>Password *</label>
              <input
                type="password"
                className="input-field"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                style={{ width: "100%" }}
              />
            </div>

            {/* Professional Specific Fields */}
            {selectedRole !== "PATIENT" && (
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem", marginTop: "0.5rem", display: "grid", gap: "1rem" }}>
                <h4 style={{ margin: "0", fontSize: "0.95rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <ShieldCheck size={16} /> Professional License & Credentials
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.85rem" }}>
                      {selectedRole === "DOCTOR" ? "Medical License Number *" : selectedRole === "DIETITIAN" ? "Dietetic License Number *" : "Culinary/FSSAI License *"}
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder={selectedRole === "DOCTOR" ? "MD-98214" : selectedRole === "DIETITIAN" ? "RD-88412" : "FSSAI-2024-88"}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.85rem" }}>
                      {selectedRole === "HOTEL" ? "Cuisine Specialty" : "Medical Degree / Qualifications *"}
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required={selectedRole !== "HOTEL"}
                      value={selectedRole === "HOTEL" ? formData.cuisineType : formData.degree}
                      onChange={(e) =>
                        selectedRole === "HOTEL"
                          ? setFormData({ ...formData, cuisineType: e.target.value })
                          : setFormData({ ...formData, degree: e.target.value })
                      }
                      placeholder={selectedRole === "DOCTOR" ? "MBBS, MD - Endocrinology" : selectedRole === "DIETITIAN" ? "M.Sc Nutrition, RD" : "Clinical & Therapeutic"}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.85rem" }}>Specialization</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g. Cardiometabolic, Renal, Diabetology"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.85rem" }}>Hospital / Clinic / Kitchen Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.hospitalOrClinic}
                      onChange={(e) => setFormData({ ...formData, hospitalOrClinic: e.target.value })}
                      placeholder="e.g. Metropolitan Medical Center"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                {selectedRole !== "HOTEL" && (
                  <div>
                    <label className="form-label" style={{ fontSize: "0.85rem" }}>Clinical Achievements & Accreditations</label>
                    <textarea
                      className="input-field"
                      rows={2}
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      placeholder="e.g. Fellow of American College of Physicians, 12 years clinical practice, 20+ published studies..."
                      style={{ width: "100%" }}
                    />
                  </div>
                )}

                {/* License Document Upload */}
                <div>
                  <label className="form-label" style={{ fontSize: "0.85rem" }}>Upload License Certificate / Document</label>
                  <div style={{ border: "2px dashed rgba(255, 255, 255, 0.15)", padding: "1.25rem", borderRadius: "10px", textAlign: "center", background: "rgba(255, 255, 255, 0.02)" }}>
                    <Upload size={24} color="var(--primary)" style={{ marginBottom: "0.5rem" }} />
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      {uploadedFileName ? (
                        <span style={{ color: "var(--primary)", fontWeight: 600 }}>Uploaded: {uploadedFileName}</span>
                      ) : (
                        "Upload PDF or image of your medical/culinary license"
                      )}
                    </div>
                    <label className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", cursor: "pointer", display: "inline-block" }}>
                      {uploadingFile ? "Uploading Certificate..." : "Browse Certificate File"}
                      <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: "none" }} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || uploadingFile}
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.85rem", fontSize: "0.95rem" }}
            >
              {isLoading ? "Submitting Application..." : selectedRole === "PATIENT" ? "Create Patient Account" : "Submit Professional Application"}
            </button>

            <p className="text-center text-muted" style={{ margin: "0.75rem 0 0 0", fontSize: "0.85rem", textAlign: "center" }}>
              Already have an account? <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
