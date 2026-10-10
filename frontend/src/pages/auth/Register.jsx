import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Stethoscope, Apple, Utensils, User, ShieldCheck, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import * as authService from "../../services/authService";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [selectedRole, setSelectedRole] = useState("PATIENT");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: emailParam,
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
    <div className="auth-container" style={{ padding: "3rem 1.5rem" }}>
      {/* Background Soft Curves */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-10%",
        width: "50vw",
        height: "60vh",
        background: "radial-gradient(circle, rgba(224, 242, 254, 0.7) 0%, rgba(240, 249, 255, 0) 70%)",
        pointerEvents: "none"
      }} />

      <div className="auth-card" style={{ maxWidth: selectedRole === "PATIENT" ? "520px" : "720px", width: "100%", margin: "0 auto", padding: "2.5rem" }}>
        
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "1.75rem" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1rem" }}>
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
          <h2 style={{ fontSize: "1.65rem", fontWeight: "800", margin: "0 0 0.35rem 0", color: "#0f172a" }}>
            Create Your Account
          </h2>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
            Select your clinical role to join the NutriSphere healthcare network
          </p>
        </div>

        {/* Role Tabs */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
          marginBottom: "1.75rem",
          background: "#f1f5f9",
          padding: "0.4rem",
          borderRadius: "14px"
        }}>
          {[
            { id: "PATIENT", label: "Patient", icon: <User size={16} /> },
            { id: "DOCTOR", label: "Doctor", icon: <Stethoscope size={16} /> },
            { id: "DIETITIAN", label: "Dietitian", icon: <Apple size={16} /> },
            { id: "HOTEL", label: "Kitchen", icon: <Utensils size={16} /> },
          ].map((tab) => {
            const isSelected = selectedRole === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setSelectedRole(tab.id); setError(""); }}
                style={{
                  background: isSelected ? "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)" : "transparent",
                  color: isSelected ? "#ffffff" : "#475569",
                  fontWeight: isSelected ? 700 : 500,
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.65rem 0.25rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.8rem",
                  boxShadow: isSelected ? "0 4px 12px rgba(2, 132, 199, 0.25)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Verification Notice for Professionals */}
        {selectedRole !== "PATIENT" && (
          <div style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            padding: "0.85rem 1rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            fontSize: "0.85rem",
            color: "#b45309",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.6rem"
          }}>
            <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: "0.05rem", color: "#d97706" }} />
            <div>
              <strong>License Verification Required:</strong> Clinical practitioners and culinary partners must provide valid credentials. An administrator reviews every credential before activating full clinical privileges.
            </div>
          </div>
        )}

        {/* Success Modal/Notice */}
        {successInfo ? (
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "2rem", borderRadius: "16px", textAlign: "center" }}>
            <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: "0.75rem" }} />
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#065f46", fontSize: "1.3rem" }}>{successInfo.title}</h3>
            <p style={{ color: "#047857", fontSize: "0.95rem", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
              {successInfo.message}
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: "inline-block" }}>
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Basic Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Marcus"
                />
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Sterling"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: selectedRole === "PATIENT" ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@nutrisphere.com"
                />
              </div>
              {selectedRole !== "PATIENT" && (
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
              />
            </div>

            {/* Professional Specific Fields */}
            {selectedRole !== "PATIENT" && (
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginTop: "0.5rem", display: "grid", gap: "1rem" }}>
                <h4 style={{ margin: "0", fontSize: "0.95rem", color: "#0284c7", display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
                  <ShieldCheck size={18} /> Professional License & Credentials
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">
                      {selectedRole === "DOCTOR" ? "Medical License Number *" : selectedRole === "DIETITIAN" ? "Dietetic License Number *" : "Culinary/Operating License *"}
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder={selectedRole === "DOCTOR" ? "MD-98214" : selectedRole === "DIETITIAN" ? "RD-88412" : "FSSAI-2024-88"}
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      {selectedRole === "HOTEL" ? "Cuisine Specialty" : "Medical Qualifications *"}
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      required={selectedRole !== "HOTEL"}
                      value={selectedRole === "HOTEL" ? formData.cuisineType : formData.degree}
                      onChange={(e) =>
                        selectedRole === "HOTEL"
                          ? setFormData({ ...formData, cuisineType: e.target.value })
                          : setFormData({ ...formData, degree: e.target.value })
                      }
                      placeholder={selectedRole === "DOCTOR" ? "MBBS, MD - Cardiology" : selectedRole === "DIETITIAN" ? "M.Sc Clinical Nutrition, RD" : "Clinical & Therapeutic"}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g. Preventive Cardiology, Renal"
                    />
                  </div>
                  <div>
                    <label className="form-label">Hospital / Clinic / Kitchen Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.hospitalOrClinic}
                      onChange={(e) => setFormData({ ...formData, hospitalOrClinic: e.target.value })}
                      placeholder="e.g. Boston Medical Center"
                    />
                  </div>
                </div>

                {selectedRole !== "HOTEL" && (
                  <div>
                    <label className="form-label">Clinical Accreditations & Honors</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      placeholder="e.g. Fellow of American College of Cardiology (FACC), 12 years clinical practice..."
                    />
                  </div>
                )}

                {/* License Document Upload */}
                <div>
                  <label className="form-label">Upload License Certificate / Document</label>
                  <div style={{
                    border: "2px dashed #bae6fd",
                    padding: "1.5rem",
                    borderRadius: "14px",
                    textAlign: "center",
                    background: "#f0f9ff"
                  }}>
                    <Upload size={26} color="#0284c7" style={{ marginBottom: "0.5rem" }} />
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.6rem" }}>
                      {uploadedFileName ? (
                        <span style={{ color: "#0284c7", fontWeight: 700 }}>Uploaded: {uploadedFileName}</span>
                      ) : (
                        "Upload PDF or scanned copy of your medical/operating license"
                      )}
                    </div>
                    <label className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", cursor: "pointer", display: "inline-block" }}>
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
              style={{ width: "100%", marginTop: "0.75rem", padding: "0.9rem", fontSize: "1rem", borderRadius: "12px" }}
            >
              {isLoading ? "Submitting Application..." : selectedRole === "PATIENT" ? "Create Patient Account" : "Submit Professional Application"}
            </button>

            <p style={{ margin: "1rem 0 0 0", fontSize: "0.9rem", textAlign: "center", color: "#64748b" }}>
              Already registered? <Link to="/login" style={{ color: "#0284c7", textDecoration: "none", fontWeight: 700 }}>Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
