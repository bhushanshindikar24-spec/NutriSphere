import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  User, 
  Edit3, 
  Droplet, 
  Flame, 
  Target, 
  ShieldAlert, 
  HeartPulse, 
  Activity, 
  Stethoscope, 
  Sparkles, 
  FileText, 
  Upload, 
  Calendar, 
  Clock, 
  Pill, 
  Dna, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  TrendingUp,
  X
} from "lucide-react";
import api from "../../services/api";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [bloodReports, setBloodReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Blood report upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [analyzingReportId, setAnalyzingReportId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // New report form state
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("LAB_REPORT");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportNotes, setReportNotes] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [biomarkers, setBiomarkers] = useState({
    fastingGlucose: "",
    hba1c: "",
    vitaminD: "",
    vitaminB12: "",
    ldlCholesterol: "",
    ferritin: "",
    hemoglobin: "",
  });

  const fetchData = async () => {
    try {
      const [profRes, medRes, labRes] = await Promise.allSettled([
        api.get("/patients/profile"),
        api.get("/medical/history/my"),
        api.get("/medical/laboratory/my")
      ]);

      if (profRes.status === "fulfilled") {
        setProfileData(profRes.value.data?.data || profRes.value.data || {});
      } else {
        setProfileData({});
      }

      if (medRes.status === "fulfilled") {
        const hist = medRes.value.data?.data || medRes.value.data || [];
        setMedicalHistory(Array.isArray(hist) ? hist : []);
      } else {
        setMedicalHistory([]);
      }

      if (labRes.status === "fulfilled") {
        const labs = labRes.value.data?.data || labRes.value.data || [];
        setBloodReports(Array.isArray(labs) ? labs : []);
      } else {
        setBloodReports([]);
      }
    } catch (_err) {
      setProfileData({});
      setMedicalHistory([]);
      setBloodReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRunAiAnalysis = async (reportId) => {
    setAnalyzingReportId(reportId);
    try {
      const res = await api.post(`/medical/laboratory/${reportId}/analyze`);
      const analysis = res.data?.data || res.data;
      setSelectedAnalysis(analysis);
      // Refresh reports to pick up updated AI summary
      const repRes = await api.get("/medical/laboratory/my");
      const updatedList = repRes.data?.data || repRes.data || [];
      if (Array.isArray(updatedList)) setBloodReports(updatedList);
    } catch (err) {
      alert("Failed to run AI deficiency analysis. Please try again.");
    } finally {
      setAnalyzingReportId(null);
    }
  };

  const handleUploadReport = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess("");

    if (!reportTitle.trim()) {
      setUploadError("Please provide a report title.");
      setUploadLoading(false);
      return;
    }

    try {
      // 1. Create laboratory report entry
      const repRes = await api.post("/medical/laboratory", {
        title: reportTitle.trim(),
        reportType,
        reportDate,
        notes: reportNotes || "Uploaded via Patient Profile Portal",
        fileName: reportFile ? reportFile.name : null,
        status: "COMPLETED",
      });

      const reportId = repRes.data?.data?.id || repRes.data?.id;

      // 2. Add laboratory values if entered
      if (reportId) {
        const valEntries = [
          { parameterName: "Fasting Blood Glucose", value: biomarkers.fastingGlucose, unit: "mg/dL", normalRange: "70 - 99" },
          { parameterName: "HbA1c", value: biomarkers.hba1c, unit: "%", normalRange: "< 5.7" },
          { parameterName: "Vitamin D3 (25-OH)", value: biomarkers.vitaminD, unit: "ng/mL", normalRange: "30.0 - 100.0" },
          { parameterName: "Vitamin B12", value: biomarkers.vitaminB12, unit: "pg/mL", normalRange: "200 - 900" },
          { parameterName: "LDL Cholesterol", value: biomarkers.ldlCholesterol, unit: "mg/dL", normalRange: "< 100" },
          { parameterName: "Serum Ferritin", value: biomarkers.ferritin, unit: "ng/mL", normalRange: "30 - 200" },
          { parameterName: "Hemoglobin", value: biomarkers.hemoglobin, unit: "g/dL", normalRange: "12.0 - 16.0" },
        ];

        for (const v of valEntries) {
          if (v.value && v.value.trim()) {
            await api.post(`/medical/laboratory/${reportId}/values`, v).catch(() => {});
          }
        }

        // Trigger AI analysis automatically on new upload
        try {
          await api.post(`/medical/laboratory/${reportId}/analyze`);
        } catch (_aiErr) {}
      }

      setUploadSuccess("Blood report uploaded and AI analysis initiated successfully!");
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess("");
        setReportTitle("");
        setReportNotes("");
        setReportFile(null);
        setBiomarkers({
          fastingGlucose: "",
          hba1c: "",
          vitaminD: "",
          vitaminB12: "",
          ldlCholesterol: "",
          ferritin: "",
          hemoglobin: "",
        });
        fetchData();
      }, 1200);
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || "Failed to upload blood report.");
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Patient Profile & Health Records...</div>;

  const allergyList = typeof profileData?.allergies === "string"
    ? profileData.allergies.split(",").map((s) => s.trim()).filter(Boolean)
    : (Array.isArray(profileData?.allergies) ? profileData.allergies : []);

  const intoleranceList = typeof profileData?.foodIntolerances === "string"
    ? profileData.foodIntolerances.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const initialLetter = (user?.email || profileData?.email || user?.firstName || "U").charAt(0).toUpperCase();

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      {/* Top Profile Header Banner */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem 2rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.85rem",
              fontWeight: 800,
              boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)"
            }}>
              {initialLetter}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: "1.45rem", fontWeight: 800, color: "#0f172a" }}>
                  {profileData?.firstName || user?.firstName || "Patient"} {profileData?.lastName || user?.lastName || ""}
                </h2>
                <span style={{
                  background: "#f0f9ff",
                  color: "#0284c7",
                  border: "1px solid rgba(2, 132, 199, 0.2)",
                  padding: "0.2rem 0.65rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  {user?.role || "PATIENT"}
                </span>
                {profileData?.bloodGroup && (
                  <span style={{
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid rgba(220, 38, 38, 0.2)",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }}>
                    Blood Group: {profileData.bloodGroup}
                  </span>
                )}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                <span>{user?.email || profileData?.email}</span>
                {profileData?.phoneNumber && (
                  <span> • {profileData.phoneNumber}</span>
                )}
                {profileData?.id && (
                  <span> • Patient ID #{profileData.id}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                background: "#f0f9ff",
                border: "1px solid rgba(2, 132, 199, 0.3)",
                color: "#0284c7",
                padding: "0.65rem 1.15rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Upload size={16} />
              Upload Blood Report
            </button>

            <button
              onClick={() => navigate("/patient/profile/edit")}
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                border: "none",
                color: "#ffffff",
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)"
              }}
            >
              <Edit3 size={16} />
              Edit Profile & Health Record
            </button>
          </div>
        </div>
      </div>

      {/* Two Sides Grid Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
        gap: "2rem",
        alignItems: "start"
      }}>

        {/* ============================================================ */}
        {/* SIDE 1: PERSONAL INFORMATION, BIOMETRICS & LIFESTYLE           */}
        {/* ============================================================ */}
        <div style={{ display: "grid", gap: "1.75rem" }}>
          
          {/* Card 1: Personal Demographics & Contact */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <User size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                1. Personal Identity & Contact
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>First Name</span>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  {profileData?.firstName || user?.firstName || "--"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Last Name</span>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  {profileData?.lastName || user?.lastName || "--"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Date of Birth / Age</span>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  {profileData?.dateOfBirth ? `${profileData.dateOfBirth} (${profileData.age ? `${profileData.age} yrs` : ""})` : "Not specified"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Biological Sex</span>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  {profileData?.gender || "Not specified"}
                </strong>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Registered Email Address</span>
                <strong style={{ fontSize: "0.95rem", color: "#0284c7" }}>
                  {user?.email || profileData?.email || "--"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Phone Number</span>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  {profileData?.phoneNumber || user?.phoneNumber || "Not provided"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Occupation / Status</span>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  {profileData?.occupation || "Not specified"}
                </strong>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Emergency Contact</span>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  {profileData?.emergencyContactName ? (
                    `${profileData.emergencyContactName} ${profileData.emergencyContactPhone ? `(${profileData.emergencyContactPhone})` : ""}`
                  ) : "None specified"}
                </strong>
              </div>
            </div>
          </div>

          {/* Card 2: Biometrics & Vital Signs */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <HeartPulse size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                2. Physical Biometrics & Vital Signs
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Height</span>
                <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                  {profileData?.heightCm ? `${profileData.heightCm} cm` : "--"}
                </strong>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Current Weight</span>
                <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                  {profileData?.weightKg ? `${profileData.weightKg} kg` : "--"}
                </strong>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Body Mass Index</span>
                <strong style={{ fontSize: "1.05rem", color: profileData?.bmi > 25 ? "#f59e0b" : "#10B981" }}>
                  {profileData?.bmi ? `${profileData.bmi} kg/m²` : "--"}
                </strong>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Blood Pressure</span>
                <strong style={{ fontSize: "1rem", color: "#0f172a" }}>
                  {profileData?.bloodPressure || "--"}
                </strong>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Resting Heart Rate</span>
                <strong style={{ fontSize: "1rem", color: "#0f172a" }}>
                  {profileData?.restingHeartRate ? `${profileData.restingHeartRate} bpm` : "--"}
                </strong>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Blood Group</span>
                <strong style={{ fontSize: "1rem", color: "#dc2626" }}>
                  {profileData?.bloodGroup || profileData?.bloodType || "Not specified"}
                </strong>
              </div>
            </div>
          </div>

          {/* Card 3: Physical Activity & Habits */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <Flame size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                3. Physical Activity & Habits
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ gridColumn: "span 2" }}>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Activity Level</span>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                  {profileData?.activityLevel || "Not specified"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Type of Exercise</span>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                  {profileData?.exerciseType || "Not specified"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Frequency & Duration</span>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                  {profileData?.exerciseFrequencyDuration || "Not specified"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Smoking / Tobacco</span>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                  {profileData?.smokingTobacco || "None / Non-smoker"}
                </strong>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Alcohol Consumption</span>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                  {profileData?.alcoholConsumption || "None"}
                </strong>
              </div>
            </div>
          </div>

          {/* Card 4: Dietary Patterns & Hydration */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <Droplet size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                4. Dietary Preferences & Intake Patterns
              </h3>
            </div>

            <div style={{ display: "grid", gap: "1.1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Dietary Preference</span>
                  <span style={{
                    display: "inline-block",
                    marginTop: "0.2rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "8px",
                    background: "#ecfdf5",
                    color: "#059669",
                    fontWeight: 700,
                    fontSize: "0.85rem"
                  }}>
                    {profileData?.dietaryPreference || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Daily Water Intake</span>
                  <strong style={{ fontSize: "0.95rem", color: "#0284c7" }}>
                    {profileData?.currentWaterIntakeLiters ? `${profileData.currentWaterIntakeLiters} L/day` : "Not specified"}
                  </strong>
                </div>
              </div>

              {/* Single Unified Allergies Display (No Duplicates) */}
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.35rem" }}>
                  Food Allergies
                </span>
                {allergyList.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {allergyList.map((alg) => (
                      <span
                        key={alg}
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          color: "#dc2626",
                          padding: "0.2rem 0.65rem",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 600
                        }}
                      >
                        ⚠️ {alg}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>No known food allergies reported</span>
                )}
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.35rem" }}>
                  Food Intolerances
                </span>
                {intoleranceList.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {intoleranceList.map((item) => (
                      <span
                        key={item}
                        style={{
                          background: "#fffbeb",
                          border: "1px solid #fde68a",
                          color: "#d97706",
                          padding: "0.2rem 0.65rem",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 600
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {profileData?.foodIntolerances || "None reported"}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Meals Per Day</span>
                  <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                    {profileData?.mealsPerDay || "Not specified"}
                  </strong>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Usual Meal Timings</span>
                  <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                    {profileData?.mealTimings || "Not specified"}
                  </strong>
                </div>
              </div>

              {profileData?.typicalFoodIntake && (
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block" }}>Typical Meal-by-Meal Intake</span>
                  <p style={{ margin: "0.3rem 0 0 0", fontSize: "0.88rem", color: "#334155", background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                    {profileData.typicalFoodIntake}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SIDE 2: MEDICAL HISTORY (PAST, PRESENT) & BLOOD REPORTS      */}
        {/* ============================================================ */}
        <div style={{ display: "grid", gap: "1.75rem" }}>

          {/* Card 5: Diagnosed Health Conditions & Symptoms */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <Stethoscope size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                5. Diagnosed Conditions & Symptoms
              </h3>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.3rem" }}>
                  Active Diagnosed Conditions
                </span>
                <p style={{ margin: 0, fontSize: "0.92rem", color: "#0f172a", fontWeight: 600 }}>
                  {profileData?.diagnosedConditions || profileData?.activeCondition || "No clinical conditions reported"}
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.3rem" }}>
                  Current Symptoms
                </span>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155" }}>
                  {profileData?.currentSymptoms || "No current acute symptoms recorded"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 6: Surgeries & Family Hereditary History */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <Dna size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                6. Surgeries & Family Medical History
              </h3>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.3rem" }}>
                  Previous Surgeries & Procedures
                </span>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155" }}>
                  {profileData?.previousSurgeries || "None reported"}
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.3rem" }}>
                  Family Hereditary History
                </span>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155" }}>
                  {profileData?.familyMedicalHistory || "No hereditary risk factors recorded"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 7: Medications & Supplements */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <Pill size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                7. Medications & Vitamins Taken
              </h3>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.3rem" }}>
                  Current Medications & Dosages
                </span>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155", fontWeight: 500 }}>
                  {profileData?.currentMedications || "No prescription medications currently active"}
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.3rem" }}>
                  Vitamins & Supplements Currently Taken
                </span>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155", fontWeight: 500 }}>
                  {profileData?.vitaminsSupplements || "None reported"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 8: Blood Reports & AI Nutrition Recommendations */}
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Activity size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  8. Diagnostic Blood Reports & AI
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Plus size={14} /> Upload Report
              </button>
            </div>

            {/* AI Analysis Preview if selected */}
            {selectedAnalysis && (
              <div style={{
                background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)",
                border: "1.5px solid #0284c7",
                borderRadius: "12px",
                padding: "1.25rem",
                marginBottom: "1.25rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontWeight: 700, fontSize: "0.95rem" }}>
                    <Sparkles size={16} /> AI Clinical Deficiency Insights
                  </div>
                  <button onClick={() => setSelectedAnalysis(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                    <X size={16} />
                  </button>
                </div>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#1e293b", lineHeight: 1.5 }}>
                  {selectedAnalysis.aiSummary}
                </p>
                {selectedAnalysis.identifiedDeficiencies && (
                  <div style={{ fontSize: "0.8rem", color: "#dc2626", marginBottom: "0.35rem" }}>
                    <strong>Biomarker Alerts:</strong> {selectedAnalysis.identifiedDeficiencies}
                  </div>
                )}
                {selectedAnalysis.recommendedFoodSources && (
                  <div style={{ fontSize: "0.8rem", color: "#059669" }}>
                    🥗 <strong>Target Whole Foods:</strong> {Array.isArray(selectedAnalysis.recommendedFoodSources) ? selectedAnalysis.recommendedFoodSources.join(", ") : selectedAnalysis.recommendedFoodSources}
                  </div>
                )}
              </div>
            )}

            {/* Reports List */}
            {bloodReports.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "2rem 1rem",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1"
              }}>
                <FileText size={36} color="#94a3b8" style={{ margin: "0 auto 0.75rem auto" }} />
                <div style={{ fontWeight: 600, color: "#334155", fontSize: "0.92rem" }}>No Blood Reports Uploaded</div>
                <p className="text-muted" style={{ margin: "0.25rem 0 1rem 0", fontSize: "0.8rem" }}>
                  Upload your lab results (PDF or images) to detect deficiencies and receive food recommendations.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    cursor: "pointer"
                  }}
                >
                  Upload First Blood Report
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.85rem" }}>
                {bloodReports.map((rep) => (
                  <div
                    key={rep.id}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                      borderRadius: "10px",
                      padding: "1rem",
                      display: "grid",
                      gap: "0.6rem"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                          {rep.title}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", gap: "0.6rem", marginTop: "0.2rem" }}>
                          <span>📅 {rep.reportDate || "Recent"}</span>
                          <span>• {rep.reportType || "LAB_REPORT"}</span>
                          {rep.fileName && <span>• 📎 {rep.fileName}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRunAiAnalysis(rep.id)}
                        disabled={analyzingReportId === rep.id}
                        style={{
                          background: "#f0f9ff",
                          border: "1px solid rgba(2, 132, 199, 0.3)",
                          color: "#0284c7",
                          padding: "0.4rem 0.75rem",
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem"
                        }}
                      >
                        <Sparkles size={14} />
                        {analyzingReportId === rep.id ? "Analyzing..." : "Run AI Analysis"}
                      </button>
                    </div>

                    {rep.aiSummary && (
                      <div style={{
                        background: "#ffffff",
                        padding: "0.7rem",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.8rem",
                        color: "#334155"
                      }}>
                        <div style={{ fontWeight: 600, color: "#0284c7", marginBottom: "0.25rem" }}>
                          ✨ AI Clinical Insights:
                        </div>
                        <div>{rep.aiSummary}</div>
                        {rep.recommendedFoodSources && (
                          <div style={{ marginTop: "0.35rem", color: "#059669", fontWeight: 600 }}>
                            🥗 Recommended: {rep.recommendedFoodSources}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* UPLOAD BLOOD REPORT MODAL                                     */}
      {/* ============================================================ */}
      {showUploadModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="glass-panel" style={{
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "2rem",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ background: "#f0f9ff", padding: "0.5rem", borderRadius: "8px", color: "#0284c7" }}>
                  <Upload size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                  Upload Diagnostic Blood Report
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {uploadSuccess && (
              <div style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem"
              }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem"
              }}>
                <AlertCircle size={18} color="#dc2626" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadReport} style={{ display: "grid", gap: "1.1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Blood Count (CBC) & Vitamin Profile"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="LAB_REPORT">General Blood Panel</option>
                    <option value="LIPID">Lipid Profile</option>
                    <option value="METABOLIC">Metabolic Panel (CMP / BMP)</option>
                    <option value="VITAMINS">Vitamin & Micronutrient Screen</option>
                    <option value="THYROID">Thyroid Function (TSH, T3, T4)</option>
                    <option value="DIABETES">Glycemic / HbA1c Panel</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Test Date
                  </label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
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
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Attach Lab Document (PDF / Image)
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={(e) => setReportFile(e.target.files[0])}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    fontSize: "0.85rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
                  Optional Key Biomarkers (Auto-feeds AI Deficiency Model)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="Fasting Glucose (mg/dL)"
                    value={biomarkers.fastingGlucose}
                    onChange={(e) => setBiomarkers({ ...biomarkers, fastingGlucose: e.target.value })}
                    style={{ padding: "0.55rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem" }}
                  />
                  <input
                    type="text"
                    placeholder="HbA1c (%)"
                    value={biomarkers.hba1c}
                    onChange={(e) => setBiomarkers({ ...biomarkers, hba1c: e.target.value })}
                    style={{ padding: "0.55rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem" }}
                  />
                  <input
                    type="text"
                    placeholder="Vitamin D3 (ng/mL)"
                    value={biomarkers.vitaminD}
                    onChange={(e) => setBiomarkers({ ...biomarkers, vitaminD: e.target.value })}
                    style={{ padding: "0.55rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem" }}
                  />
                  <input
                    type="text"
                    placeholder="Vitamin B12 (pg/mL)"
                    value={biomarkers.vitaminB12}
                    onChange={(e) => setBiomarkers({ ...biomarkers, vitaminB12: e.target.value })}
                    style={{ padding: "0.55rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem" }}
                  />
                  <input
                    type="text"
                    placeholder="LDL Cholesterol (mg/dL)"
                    value={biomarkers.ldlCholesterol}
                    onChange={(e) => setBiomarkers({ ...biomarkers, ldlCholesterol: e.target.value })}
                    style={{ padding: "0.55rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem" }}
                  />
                  <input
                    type="text"
                    placeholder="Serum Ferritin (ng/mL)"
                    value={biomarkers.ferritin}
                    onChange={(e) => setBiomarkers({ ...biomarkers, ferritin: e.target.value })}
                    style={{ padding: "0.55rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Clinical Notes / Context
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fasting 10 hours prior to test. Ordered by Doctor."
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    padding: "0.65rem 1.2rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#475569",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.65rem 1.4rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: uploadLoading ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Upload size={16} />
                  {uploadLoading ? "Uploading & Analyzing..." : "Save & Analyze Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
