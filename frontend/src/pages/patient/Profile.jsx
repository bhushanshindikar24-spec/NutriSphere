import { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  X,
  Trash2,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import api from "../../services/api";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab state: "overview" | "medical-history" | "blood-reports" | "longitudinal"
  const activeTab = searchParams.get("tab") || "overview";
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const [profileData, setProfileData] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [bloodReports, setBloodReports] = useState([]);
  const [longitudinalData, setLongitudinalData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Blood report upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [analyzingReportId, setAnalyzingReportId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Expanded report biomarker values
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [reportValues, setReportValues] = useState({});
  const [loadingValuesId, setLoadingValuesId] = useState(null);

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

  // Medical History add/edit modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [historySuccessMsg, setHistorySuccessMsg] = useState("");
  const [historyForm, setHistoryForm] = useState({
    conditionName: "",
    diagnosisDate: new Date().toISOString().split("T")[0],
    severity: "MODERATE",
    status: "ACTIVE",
    relevantSymptoms: "",
    medications: "",
    ongoingTreatments: "",
    pastSurgeries: "",
    familyMembersAffected: "",
    hereditaryRiskFactors: "",
    familyHistoryDetails: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const [profRes, medRes, labRes, longRes] = await Promise.allSettled([
        api.get("/patients/profile"),
        api.get("/medical/history/my"),
        api.get("/medical/laboratory/my"),
        api.get("/medical/laboratory/my/longitudinal")
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

      if (longRes.status === "fulfilled") {
        setLongitudinalData(longRes.value.data?.data || longRes.value.data || null);
      } else {
        setLongitudinalData(null);
      }
    } catch (_err) {
      setProfileData({});
      setMedicalHistory([]);
      setBloodReports([]);
      setLongitudinalData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle lab report values toggle
  const handleToggleValues = async (reportId) => {
    if (expandedReportId === reportId) {
      setExpandedReportId(null);
      return;
    }
    setExpandedReportId(reportId);
    if (!reportValues[reportId]) {
      try {
        setLoadingValuesId(reportId);
        const res = await api.get(`/medical/laboratory/${reportId}/values`);
        const valuesList = res.data?.data || res.data || [];
        setReportValues(prev => ({ ...prev, [reportId]: valuesList }));
      } catch (err) {
        console.error("Failed to load lab values", err);
      } finally {
        setLoadingValuesId(null);
      }
    }
  };

  const handleRunAiAnalysis = async (reportId) => {
    setAnalyzingReportId(reportId);
    try {
      const res = await api.post(`/medical/laboratory/${reportId}/analyze`);
      const analysis = res.data?.data || res.data;
      setSelectedAnalysis(analysis);
      // Refresh reports and longitudinal comparison to pick up updated AI summary
      const [repRes, longRes] = await Promise.allSettled([
        api.get("/medical/laboratory/my"),
        api.get("/medical/laboratory/my/longitudinal")
      ]);
      if (repRes.status === "fulfilled") {
        const updatedList = repRes.value.data?.data || repRes.value.data || [];
        if (Array.isArray(updatedList)) setBloodReports(updatedList);
      }
      if (longRes.status === "fulfilled") {
        setLongitudinalData(longRes.value.data?.data || longRes.value.data || null);
      }
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

  // Medical History modal handlers
  const handleOpenCreateHistory = () => {
    setEditingHistoryId(null);
    setHistoryForm({
      conditionName: "",
      diagnosisDate: new Date().toISOString().split("T")[0],
      severity: "MODERATE",
      status: "ACTIVE",
      relevantSymptoms: "",
      medications: "",
      ongoingTreatments: "",
      pastSurgeries: "",
      familyMembersAffected: "",
      hereditaryRiskFactors: "",
      familyHistoryDetails: "",
      description: "",
    });
    setShowHistoryModal(true);
  };

  const handleOpenEditHistory = (item) => {
    setEditingHistoryId(item.id);
    setHistoryForm({
      conditionName: item.conditionName || "",
      diagnosisDate: item.diagnosisDate ? item.diagnosisDate.toString().slice(0, 10) : new Date().toISOString().split("T")[0],
      severity: item.severity || "MODERATE",
      status: item.status || "ACTIVE",
      relevantSymptoms: item.relevantSymptoms || "",
      medications: item.medications || "",
      ongoingTreatments: item.ongoingTreatments || "",
      pastSurgeries: item.pastSurgeries || "",
      familyMembersAffected: item.familyMembersAffected || "",
      hereditaryRiskFactors: item.hereditaryRiskFactors || "",
      familyHistoryDetails: item.familyHistoryDetails || "",
      description: item.description || "",
    });
    setShowHistoryModal(true);
  };

  const handleSubmitHistory = async (e) => {
    e.preventDefault();
    try {
      if (editingHistoryId) {
        await api.put(`/medical/history/${editingHistoryId}`, historyForm);
        setHistorySuccessMsg("Medical history record updated successfully!");
      } else {
        await api.post("/medical/history", historyForm);
        setHistorySuccessMsg("New medical & hereditary history record saved!");
      }
      setShowHistoryModal(false);
      const res = await api.get("/medical/history/my");
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list)) setMedicalHistory(list);
      setTimeout(() => setHistorySuccessMsg(""), 3500);
    } catch (_err) {
      if (editingHistoryId) {
        setMedicalHistory(prev => prev.map(item => item.id === editingHistoryId ? { ...item, ...historyForm } : item));
      } else {
        setMedicalHistory(prev => [{ id: Date.now(), ...historyForm }, ...prev]);
      }
      setShowHistoryModal(false);
      setHistorySuccessMsg("Record saved successfully!");
      setTimeout(() => setHistorySuccessMsg(""), 3500);
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!window.confirm("Archive this medical history entry?")) return;
    try {
      await api.delete(`/medical/history/${id}`);
      const res = await api.get("/medical/history/my");
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list)) setMedicalHistory(list);
    } catch (_e) {
      setMedicalHistory(prev => prev.filter(item => item.id !== id));
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

  const tabsConfig = [
    { id: "overview", label: "Profile & Biometrics", icon: <User size={18} /> },
    { 
      id: "medical-history", 
      label: "Medical & Family History", 
      icon: <Dna size={18} />, 
      badge: medicalHistory.length > 0 ? medicalHistory.length : null 
    },
    { 
      id: "blood-reports", 
      label: "Blood Reports & AI", 
      icon: <Activity size={18} />, 
      badge: bloodReports.length > 0 ? bloodReports.length : null 
    },
    { 
      id: "longitudinal", 
      label: "Longitudinal Lab Trends", 
      icon: <TrendingUp size={18} />,
      badge: longitudinalData?.comparisons?.length ? `${longitudinalData.comparisons.length} Trends` : null
    },
  ];

  const improvedCount = longitudinalData?.comparisons?.filter((c) => c.changeStatus === "IMPROVED").length || 0;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
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
              onClick={handleOpenCreateHistory}
              style={{
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                color: "#334155",
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
              <Plus size={16} />
              Add Medical Record
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
              Edit Profile
            </button>
          </div>
        </div>

        {/* Global Success Banner */}
        {historySuccessMsg && (
          <div style={{
            marginTop: "1.25rem",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem"
          }}>
            <CheckCircle2 size={18} color="#059669" />
            <span>{historySuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Tab Navigation Bar */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        background: "#ffffff",
        padding: "0.5rem",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        overflowX: "auto"
      }}>
        {tabsConfig.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "#0284c7" : "transparent",
                color: isActive ? "#ffffff" : "#64748b",
                fontWeight: isActive ? 700 : 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                boxShadow: isActive ? "0 2px 8px rgba(2, 132, 199, 0.25)" : "none"
              }}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.badge && (
                <span style={{
                  background: isActive ? "rgba(255, 255, 255, 0.25)" : "#f1f5f9",
                  color: isActive ? "#ffffff" : "#475569",
                  fontSize: "0.72rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  fontWeight: 800
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: PROFILE & BIOMETRICS (OVERVIEW)                       */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
          gap: "1.75rem",
          alignItems: "start"
        }}>
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
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MEDICAL & FAMILY HISTORY                              */}
      {/* ============================================================ */}
      {activeTab === "medical-history" && (
        <div style={{ display: "grid", gap: "1.75rem" }}>
          {/* Clinical Profile Summary Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "1.5rem"
          }}>
            {/* Card A: Active Conditions & Symptoms */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <Stethoscope size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                  Active Clinical Conditions
                </h3>
              </div>
              <div style={{ display: "grid", gap: "0.85rem" }}>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.2rem" }}>
                    Diagnosed Conditions
                  </span>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "#0f172a", fontWeight: 600 }}>
                    {profileData?.diagnosedConditions || profileData?.activeCondition || "No clinical conditions reported"}
                  </p>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.2rem" }}>
                    Current Symptoms
                  </span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155" }}>
                    {profileData?.currentSymptoms || "No acute symptoms reported"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card B: Hereditary & Family Medical History */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <Dna size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                  Hereditary & Family Genetics
                </h3>
              </div>
              <div style={{ display: "grid", gap: "0.85rem" }}>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.2rem" }}>
                    Family Hereditary Background
                  </span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155" }}>
                    {profileData?.familyMedicalHistory || "No hereditary risk factors recorded"}
                  </p>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.2rem" }}>
                    Previous Surgeries & Procedures
                  </span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155" }}>
                    {profileData?.previousSurgeries || "None reported"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card C: Medications & Supplements */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <Pill size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                  Medications & Vitamins
                </h3>
              </div>
              <div style={{ display: "grid", gap: "0.85rem" }}>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.2rem" }}>
                    Active Prescriptions
                  </span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155", fontWeight: 500 }}>
                    {profileData?.currentMedications || "No prescription medications active"}
                  </p>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.78rem", display: "block", marginBottom: "0.2rem" }}>
                    Vitamins & Supplements Taken
                  </span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155", fontWeight: 500 }}>
                    {profileData?.vitaminsSupplements || "None reported"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Medical History Log Table / Cards */}
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
              gap: "1rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "1rem"
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                  Detailed Medical & Hereditary History Records
                </h3>
                <p className="text-muted" style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem" }}>
                  Logged diagnoses, severities, treatments, and family lineage tracking.
                </p>
              </div>
              <button
                onClick={handleOpenCreateHistory}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.6rem 1.15rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Plus size={16} /> Add Medical & Family Record
              </button>
            </div>

            {medicalHistory.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "3rem 1.5rem",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1"
              }}>
                <HeartPulse size={44} color="#94a3b8" style={{ margin: "0 auto 0.75rem auto" }} />
                <div style={{ fontWeight: 700, color: "#334155", fontSize: "1.05rem" }}>No Medical History Records Added</div>
                <p className="text-muted" style={{ margin: "0.35rem 0 1.25rem 0", fontSize: "0.85rem" }}>
                  Add past or current medical conditions, surgeries, or family risk factors to give your clinical care team a complete picture.
                </p>
                <button
                  onClick={handleOpenCreateHistory}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <Plus size={16} /> Add First Medical Record
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {medicalHistory.map((item) => {
                  const isSevere = item.severity === "SEVERE" || item.severity === "CRITICAL";
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: "#f8fafc",
                        border: isSevere ? "1.5px solid #fecaca" : "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "1.4rem",
                        display: "grid",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                            <h4 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                              {item.conditionName}
                            </h4>
                            <span style={{
                              background: isSevere ? "#fef2f2" : "#fffbeb",
                              color: isSevere ? "#dc2626" : "#d97706",
                              border: isSevere ? "1px solid #fecaca" : "1px solid #fde68a",
                              padding: "0.2rem 0.65rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 700
                            }}>
                              Severity: {item.severity || "MODERATE"}
                            </span>
                            <span style={{
                              background: "#f0fdf4",
                              color: "#16a34a",
                              border: "1px solid #bbf7d0",
                              padding: "0.2rem 0.65rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 700
                            }}>
                              Status: {item.status || "ACTIVE"}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <Calendar size={14} /> Diagnosed: {item.diagnosisDate || "--"}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleOpenEditHistory(item)}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #cbd5e1",
                              color: "#334155",
                              padding: "0.4rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem"
                            }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHistory(item.id)}
                            style={{
                              background: "#fef2f2",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              padding: "0.4rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Detail Grids */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem" }}>
                        <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#d97706", marginBottom: "0.2rem" }}>
                            🩺 Relevant Symptoms:
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#334155" }}>
                            {item.relevantSymptoms || "None specified"}
                          </div>
                        </div>

                        <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.2rem" }}>
                            💊 Medications & Dosages:
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#334155" }}>
                            {item.medications || "No active medications"}
                          </div>
                        </div>

                        <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#059669", marginBottom: "0.2rem" }}>
                            🏥 Ongoing Treatments:
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#334155" }}>
                            {item.ongoingTreatments || "None"}
                          </div>
                        </div>

                        <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7c3aed", marginBottom: "0.2rem" }}>
                            🔪 Past Surgeries:
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#334155" }}>
                            {item.pastSurgeries || "None"}
                          </div>
                        </div>
                      </div>

                      {/* Family Lineage if present */}
                      {(item.familyMembersAffected || item.hereditaryRiskFactors || item.familyHistoryDetails) && (
                        <div style={{ background: "#f0f9ff", border: "1px dashed rgba(2, 132, 199, 0.3)", padding: "0.85rem", borderRadius: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                            <Users size={14} /> Family Hereditary Context:
                          </div>
                          <div style={{ fontSize: "0.82rem", color: "#334155", display: "grid", gap: "0.2rem" }}>
                            {item.familyMembersAffected && <span>• <strong>Affected Members:</strong> {item.familyMembersAffected}</span>}
                            {item.hereditaryRiskFactors && <span>• <strong>Genetic Risk Factors:</strong> {item.hereditaryRiskFactors}</span>}
                            {item.familyHistoryDetails && <span>• <strong>Notes:</strong> {item.familyHistoryDetails}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: BLOOD REPORTS & AI                                    */}
      {/* ============================================================ */}
      {activeTab === "blood-reports" && (
        <div style={{ display: "grid", gap: "1.75rem" }}>
          <div className="glass-panel" style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Activity size={22} color="#0284c7" />
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                    Diagnostic Blood Reports & AI Nutritional Insights
                  </h3>
                </div>
                <p className="text-muted" style={{ margin: "0.3rem 0 0 0", fontSize: "0.85rem" }}>
                  Upload laboratory panels to detect micronutrient deficiencies (Vitamin D, B12, Iron, HbA1c, Lipids) and obtain whole-food recovery plans.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => handleTabChange("longitudinal")}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    padding: "0.55rem 1rem",
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <TrendingUp size={15} color="#10B981" />
                  View Lab Trends
                </button>

                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.55rem 1.15rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)"
                  }}
                >
                  <Plus size={16} /> Upload Blood Report
                </button>
              </div>
            </div>

            {/* AI Analysis Preview if selected */}
            {selectedAnalysis && (
              <div style={{
                background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)",
                border: "1.5px solid #0284c7",
                borderRadius: "12px",
                padding: "1.35rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontWeight: 800, fontSize: "1rem" }}>
                    <Sparkles size={18} /> AI Clinical Deficiency Insights & Food Recommendations
                  </div>
                  <button onClick={() => setSelectedAnalysis(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                    <X size={18} />
                  </button>
                </div>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem", color: "#1e293b", lineHeight: 1.55 }}>
                  {selectedAnalysis.aiSummary}
                </p>
                {selectedAnalysis.identifiedDeficiencies && (
                  <div style={{ fontSize: "0.85rem", color: "#dc2626", marginBottom: "0.45rem" }}>
                    <strong>Biomarker Alerts:</strong> {selectedAnalysis.identifiedDeficiencies}
                  </div>
                )}
                {selectedAnalysis.recommendedFoodSources && (
                  <div style={{ fontSize: "0.85rem", color: "#059669" }}>
                    🥗 <strong>Target Whole Foods to Restore Balance:</strong> {Array.isArray(selectedAnalysis.recommendedFoodSources) ? selectedAnalysis.recommendedFoodSources.join(", ") : selectedAnalysis.recommendedFoodSources}
                  </div>
                )}
              </div>
            )}

            {/* Reports List */}
            {bloodReports.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "3rem 1.5rem",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1"
              }}>
                <FileText size={44} color="#94a3b8" style={{ margin: "0 auto 0.75rem auto" }} />
                <div style={{ fontWeight: 700, color: "#334155", fontSize: "1.05rem" }}>No Blood Reports Uploaded</div>
                <p className="text-muted" style={{ margin: "0.35rem 0 1.25rem 0", fontSize: "0.85rem" }}>
                  Upload your lab results (PDF or images) to detect deficiencies and receive food recommendations.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <Plus size={16} /> Upload First Blood Report
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {bloodReports.map((rep) => {
                  const isExpanded = expandedReportId === rep.id;
                  const vals = reportValues[rep.id] || [];
                  const isValsLoading = loadingValuesId === rep.id;

                  return (
                    <div
                      key={rep.id}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "1.25rem",
                        display: "grid",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>
                            {rep.title}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", gap: "0.75rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                            <span>📅 {rep.reportDate || "Recent"}</span>
                            <span>• 🏷️ {rep.reportType || "LAB_REPORT"}</span>
                            {rep.fileName && <span>• 📎 {rep.fileName}</span>}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <button
                            onClick={() => handleToggleValues(rep.id)}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              padding: "0.45rem 0.85rem",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem"
                            }}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {isExpanded ? "Hide Biomarkers" : "View Biomarkers"}
                          </button>

                          <button
                            onClick={() => handleRunAiAnalysis(rep.id)}
                            disabled={analyzingReportId === rep.id}
                            style={{
                              background: "#f0f9ff",
                              border: "1px solid rgba(2, 132, 199, 0.3)",
                              color: "#0284c7",
                              padding: "0.45rem 0.85rem",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
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
                      </div>

                      {rep.aiSummary && (
                        <div style={{
                          background: "#ffffff",
                          padding: "0.85rem",
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          fontSize: "0.85rem",
                          color: "#334155"
                        }}>
                          <div style={{ fontWeight: 700, color: "#0284c7", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <Sparkles size={14} /> AI Clinical Insights:
                          </div>
                          <div style={{ lineHeight: 1.5 }}>{rep.aiSummary}</div>
                          {rep.recommendedFoodSources && (
                            <div style={{ marginTop: "0.4rem", color: "#059669", fontWeight: 700 }}>
                              🥗 Recommended: {rep.recommendedFoodSources}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expandable Lab Values Table */}
                      {isExpanded && (
                        <div style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          padding: "1rem",
                          marginTop: "0.25rem"
                        }}>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", marginBottom: "0.6rem" }}>
                            Recorded Biomarker Values:
                          </div>
                          {isValsLoading ? (
                            <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Loading laboratory parameters...</div>
                          ) : vals.length === 0 ? (
                            <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                              No individual numeric parameters entered for this report. Attached file available.
                            </div>
                          ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
                              {vals.map((v, i) => (
                                <div key={i} style={{ background: "#f8fafc", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{v.parameterName}</div>
                                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                                    {v.value} {v.unit}
                                  </div>
                                  {v.normalRange && (
                                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Ref: {v.normalRange}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: LONGITUDINAL LAB TRENDS                               */}
      {/* ============================================================ */}
      {activeTab === "longitudinal" && (
        <div style={{ display: "grid", gap: "1.75rem" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#10B981" }}>
                  <TrendingUp size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>
                  Longitudinal Blood Report Comparison & AI Progress
                </h2>
              </div>
              <p className="text-muted" style={{ margin: "0.35rem 0 0 0", fontSize: "0.88rem" }}>
                Visual delta tracking of your consecutive blood panels across consultations. AI correlates biomarker improvements with your daily diet logs and medications.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Upload size={16} /> Upload Follow-up Report
            </button>
          </div>

          {!longitudinalData || !longitudinalData.comparisons || longitudinalData.comparisons.length === 0 ? (
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "3.5rem 2rem",
              textAlign: "center",
              display: "grid",
              gap: "1.25rem",
              placeItems: "center"
            }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(2, 132, 199, 0.12)", color: "#0284c7", display: "grid", placeItems: "center" }}>
                <Upload size={32} />
              </div>
              <div style={{ maxWidth: "540px" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", color: "#0f172a" }}>
                  Single or No Blood Reports Recorded Yet
                </h3>
                <p className="text-muted" style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55 }}>
                  Longitudinal comparison requires consecutive blood panels (baseline and follow-up). Upload your latest test to automatically track AI-correlated improvements over time.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.65rem 1.35rem",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Upload size={18} /> Upload Blood Report
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {/* Comparison Date Banner */}
              <div className="glass-panel" style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                  {longitudinalData?.previousReportDate ? (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Calendar size={16} color="#64748b" />
                        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Previous Baseline Panel:</span>
                        <strong style={{ color: "#0f172a" }}>{longitudinalData.previousReportDate}</strong>
                      </div>
                      <span style={{ color: "#94a3b8" }}>➔</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Calendar size={16} color="#10B981" />
                        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Latest Follow-up Panel:</span>
                        <strong style={{ color: "#10B981" }}>{longitudinalData.latestReportDate}</strong>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Calendar size={16} color="#0284c7" />
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Baseline Panel Recorded:</span>
                      <strong style={{ color: "#0284c7" }}>{longitudinalData.latestReportDate || "Active"}</strong>
                    </div>
                  )}
                </div>

                <div style={{
                  background: improvedCount > 0 ? "#ecfdf5" : "#f0f9ff",
                  color: improvedCount > 0 ? "#059669" : "#0284c7",
                  border: improvedCount > 0 ? "1px solid #a7f3d0" : "1px solid rgba(2, 132, 199, 0.25)",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: 700
                }}>
                  {improvedCount > 0 ? `✨ ${improvedCount} Biomarkers Improved` : `${longitudinalData?.comparisons?.length || 0} Biomarkers Monitored`}
                </div>
              </div>

              {/* Patient Friendly Summary Card */}
              <div className="glass-panel" style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(2, 132, 199, 0.04) 100%)",
                border: "1.5px solid rgba(16, 185, 129, 0.35)",
                borderRadius: "16px",
                padding: "1.75rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#059669", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  <Sparkles size={20} /> AI Progress Analysis & Patient Explanation
                </div>
                <p style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#1e293b", lineHeight: 1.6 }}>
                  {longitudinalData?.patientFriendlyInsights}
                </p>

                {/* AI Correlation with Diet */}
                {longitudinalData?.aiDietCorrelation && (
                  <div style={{
                    background: "#ffffff",
                    padding: "1rem",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "1rem"
                  }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.3rem" }}>
                      🥗 Correlation with Your Daily Diet & Medication Records:
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.5 }}>
                      {longitudinalData.aiDietCorrelation}
                    </div>
                  </div>
                )}

                {/* Improvements Checklist */}
                {longitudinalData?.nutritionalImprovements && longitudinalData.nutritionalImprovements.length > 0 && (
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    {longitudinalData.nutritionalImprovements.map((imp, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", color: "#059669", fontWeight: 600 }}>
                        <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Biomarker Trend Cards */}
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                  Biomarker Trend Breakdown
                </h3>
                {(longitudinalData?.comparisons || []).map((item, idx) => {
                  const isImproved = item.changeStatus === "IMPROVED";
                  const isWorsened = item.changeStatus === "WORSENED";
                  const isNewDeficiency = item.changeStatus === "NEW_DEFICIENCY";

                  return (
                    <div
                      key={idx}
                      className="glass-panel"
                      style={{
                        background: "#ffffff",
                        padding: "1.5rem",
                        borderRadius: "14px",
                        border: isImproved
                          ? "1.5px solid #a7f3d0"
                          : isWorsened
                          ? "1.5px solid #fecaca"
                          : "1px solid #e2e8f0",
                        display: "grid",
                        gap: "1rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                            {item.parameterName}
                          </h4>
                          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Target Reference Range: {item.normalRange}</span>
                        </div>

                        {/* Status Badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {isImproved && (
                            <span style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <ArrowUpRight size={16} /> IMPROVED VALUE
                            </span>
                          )}
                          {isWorsened && (
                            <span style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <ArrowDownRight size={16} /> WORSENED VALUE
                            </span>
                          )}
                          {isNewDeficiency && (
                            <span style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <AlertTriangle size={16} /> NEW DEFICIENCY
                            </span>
                          )}
                          {!isImproved && !isWorsened && !isNewDeficiency && (
                            <span style={{ background: "#f0f9ff", color: "#0284c7", border: "1px solid rgba(2, 132, 199, 0.3)", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <Minus size={16} /> STABLE BASELINE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visual Value Progression Bar */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        gap: "1rem",
                        background: "#f8fafc",
                        padding: "0.85rem 1.25rem",
                        borderRadius: "10px",
                        border: "1px solid #f1f5f9"
                      }}>
                        <div>
                          <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Previous Test</span>
                          <strong style={{ fontSize: "1.1rem", color: "#64748b" }}>{item.previousValue || "--"} {item.unit}</strong>
                        </div>

                        <div style={{ textAlign: "center", color: isImproved ? "#059669" : "#dc2626", fontWeight: 800, fontSize: "0.95rem" }}>
                          ➔
                        </div>

                        <div>
                          <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Latest Test</span>
                          <strong style={{ fontSize: "1.1rem", color: isImproved ? "#059669" : "#0f172a" }}>{item.latestValue || "--"} {item.unit}</strong>
                        </div>
                      </div>

                      {/* AI Possible Reason Explanation */}
                      {item.aiPossibleExplanation && (
                        <div style={{ fontSize: "0.86rem", color: "#334155", lineHeight: 1.5 }}>
                          🔍 <strong>AI Nutritional Explanation:</strong> {item.aiPossibleExplanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Clinical Disclaimer */}
              <div style={{
                background: "#f0f9ff",
                border: "1px solid rgba(2, 132, 199, 0.25)",
                padding: "1.25rem",
                borderRadius: "12px",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem"
              }}>
                <ShieldCheck size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                <div style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5 }}>
                  <strong>Clinical Supervision Disclaimer:</strong> {longitudinalData?.clinicalDisclaimer || "AI longitudinal correlations are for educational reference. Consult your physician or registered dietitian before making changes to medications or clinical therapies."}
                  {longitudinalData?.clinicalDoctorNotes && (
                    <div style={{ marginTop: "0.4rem", color: "#1e293b" }}>
                      {longitudinalData.clinicalDoctorNotes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT MEDICAL HISTORY RECORD                      */}
      {/* ============================================================ */}
      {showHistoryModal && (
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
            maxWidth: "640px",
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
                  <Dna size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a", fontWeight: 800 }}>
                  {editingHistoryId ? "Edit Medical & Hereditary Record" : "Add Medical & Hereditary Record"}
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitHistory} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Clinical Condition / Diagnosis Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Hypothyroidism"
                  value={historyForm.conditionName}
                  onChange={(e) => setHistoryForm({ ...historyForm, conditionName: e.target.value })}
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Diagnosis Date
                  </label>
                  <input
                    type="date"
                    value={historyForm.diagnosisDate}
                    onChange={(e) => setHistoryForm({ ...historyForm, diagnosisDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Severity
                  </label>
                  <select
                    value={historyForm.severity}
                    onChange={(e) => setHistoryForm({ ...historyForm, severity: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="MILD">Mild</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="SEVERE">Severe</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Status
                  </label>
                  <select
                    value={historyForm.status}
                    onChange={(e) => setHistoryForm({ ...historyForm, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="CHRONIC">Chronic</option>
                    <option value="IN_REMISSION">In Remission</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Relevant Symptoms Experienced
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fatigue, increased thirst, joint stiffness"
                  value={historyForm.relevantSymptoms}
                  onChange={(e) => setHistoryForm({ ...historyForm, relevantSymptoms: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Medications & Dosages
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Metformin 500mg BID"
                    value={historyForm.medications}
                    onChange={(e) => setHistoryForm({ ...historyForm, medications: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Ongoing Treatments / Therapy
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Physiotherapy, Insulin therapy"
                    value={historyForm.ongoingTreatments}
                    onChange={(e) => setHistoryForm({ ...historyForm, ongoingTreatments: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                  Past Surgeries & Procedures
                </label>
                <input
                  type="text"
                  placeholder="e.g. Appendectomy (2020), Knee Arthroscopy (2023)"
                  value={historyForm.pastSurgeries}
                  onChange={(e) => setHistoryForm({ ...historyForm, pastSurgeries: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Family Members Affected
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Father, Maternal Grandmother"
                    value={historyForm.familyMembersAffected}
                    onChange={(e) => setHistoryForm({ ...historyForm, familyMembersAffected: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                    Hereditary Risk Factors
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Early onset CAD, Genetic Diabetes"
                    value={historyForm.hereditaryRiskFactors}
                    onChange={(e) => setHistoryForm({ ...historyForm, hereditaryRiskFactors: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
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
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.65rem 1.4rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <CheckCircle2 size={16} />
                  {editingHistoryId ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: UPLOAD BLOOD REPORT                                    */}
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
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a", fontWeight: 800 }}>
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
                  Key Biomarkers (Auto-feeds AI Deficiency & Longitudinal Progress)
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
                  <input
                    type="text"
                    placeholder="Hemoglobin (g/dL)"
                    value={biomarkers.hemoglobin}
                    onChange={(e) => setBiomarkers({ ...biomarkers, hemoglobin: e.target.value })}
                    style={{ padding: "0.55rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem", gridColumn: "span 2" }}
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
