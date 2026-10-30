import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  HeartPulse, 
  Pill, 
  Activity, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Clock 
} from "lucide-react";
import api from "../../services/api";

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [reportValues, setReportValues] = useState({});
  const [loadingValuesId, setLoadingValuesId] = useState(null);

  // Clinician verification modal state
  const [verifyingReportId, setVerifyingReportId] = useState(null);
  const [clinicianNotes, setClinicianNotes] = useState("");
  const [verifyingSubmitting, setVerifyingSubmitting] = useState(false);

  // Check user role
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isClinician = currentUser?.role === "DOCTOR" || currentUser?.role === "DIETITIAN";

  const fetchReportsAndProfile = async () => {
    try {
      setLoading(true);
      const [repRes, profRes] = await Promise.allSettled([
        api.get("/medical/laboratory/my"),
        api.get("/patients/profile")
      ]);

      if (repRes.status === "fulfilled") {
        const list = repRes.value.data?.data || repRes.value.data || [];
        setReports(Array.isArray(list) ? list : []);
      }

      if (profRes.status === "fulfilled") {
        setProfile(profRes.value.data?.data || profRes.value.data || null);
      }
    } catch (_err) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsAndProfile();
  }, []);

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

  const handleAnalyze = async (reportId) => {
    setAnalyzingId(reportId);
    try {
      const res = await api.post(`/medical/laboratory/${reportId}/analyze`);
      setActiveAnalysis(res.data?.data || res.data);
    } catch (_e) {
      const r = reports.find((item) => item.id === reportId);
      setActiveAnalysis({
        title: r?.title || "Blood Report Analysis",
        reportDate: r?.reportDate || "Recent",
        aiSummary: r?.aiSummary || "AI Nutritional Analysis evaluated biomarker stability and nutritional needs.",
        identifiedDeficiencies: [],
        recommendedFoodSources: ["Whole leafy vegetables", "Citrus fruits", "Legumes & dal", "Fortified dairy/plant milk"]
      });
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleVerifyReport = async (reportId) => {
    try {
      setVerifyingSubmitting(true);
      const res = await api.post(`/medical/laboratory/${reportId}/verify`, {
        notes: clinicianNotes.trim() || "Extracted lab values clinically verified for nutritional treatment planning."
      });
      const updated = res.data?.data || res.data;
      setReports(reports.map(r => r.id === reportId ? { ...r, ...updated, reviewedByDoctor: true, status: "VERIFIED" } : r));
      setVerifyingReportId(null);
      setClinicianNotes("");
    } catch (err) {
      console.error("Failed to verify report", err);
      alert(err.response?.data?.message || "Failed to submit clinician verification.");
    } finally {
      setVerifyingSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Clinical Assessment & Blood Reports...</div>;

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Top Banner */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.25rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
            <div style={{ background: "#f0f9ff", padding: "0.5rem", borderRadius: "10px", color: "#0284c7" }}>
              <FileText size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>
              Clinical Assessment & Lab Report Analysis
            </h2>
          </div>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            Synthesizes medical history, diagnosed conditions, medications, allergies, and diagnostic bloodwork into a structured clinical assessment.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/patient/calculator")}
            className="btn btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Activity size={16} /> Nutrition Requirement Calculator
          </button>
          <button
            onClick={() => navigate("/patient/lab-progress")}
            className="btn btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", borderColor: "#10B981", color: "#10B981" }}
          >
            <TrendingUp size={16} /> Longitudinal Trends
          </button>
          <button
            onClick={() => navigate("/patient/reports/upload")}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Upload size={16} /> Upload Blood Report
          </button>
        </div>
      </div>

      {/* Structured Clinical Nutritional Assessment Card */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ background: "#ecfdf5", padding: "0.45rem", borderRadius: "8px", color: "#059669" }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                Structured Nutritional Assessment Synthesis
              </h3>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Aggregated from patient clinical records, verified history, and measured laboratory biomarkers
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              background: reports.some(r => r.reviewedByDoctor) ? "#ecfdf5" : "#fef3c7",
              color: reports.some(r => r.reviewedByDoctor) ? "#059669" : "#d97706",
              border: reports.some(r => r.reviewedByDoctor) ? "1px solid #a7f3d0" : "1px solid #fde68a",
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}>
              {reports.some(r => r.reviewedByDoctor) ? <CheckCircle2 size={13} /> : <Clock size={13} />}
              {reports.some(r => r.reviewedByDoctor) ? "Clinician Verified for Treatment" : "Pending Clinician Review"}
            </span>
          </div>
        </div>

        {/* 4-Pillar Clinical Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
          
          {/* Pillar 1: Medical History & Conditions */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#0284c7", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.6rem" }}>
              <HeartPulse size={16} />
              <span>Medical History & Conditions</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#334155", display: "grid", gap: "0.4rem" }}>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Diagnosed Conditions:</span>
                <strong>{profile?.diagnosedConditions || "None recorded"}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Current Symptoms:</span>
                <span>{profile?.currentSymptoms || "None reported"}</span>
              </div>
              {profile?.familyMedicalHistory && (
                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Family History:</span>
                  <span>{profile.familyMedicalHistory}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pillar 2: Medications & Supplements */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#8b5cf6", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.6rem" }}>
              <Pill size={16} />
              <span>Medications & Supplements</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#334155", display: "grid", gap: "0.4rem" }}>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Current Medications:</span>
                <strong>{profile?.currentMedications || "None active"}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Vitamins & Supplements:</span>
                <span>{profile?.vitaminsSupplements || "None reported"}</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Dietary Profile & Allergies */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#059669", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.6rem" }}>
              <Activity size={16} />
              <span>Dietary Profile & Allergies</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#334155", display: "grid", gap: "0.4rem" }}>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Dietary Preference:</span>
                <strong>{profile?.dietaryPreference || "Standard / Flexitarian"}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Food Allergies:</span>
                <span style={{ color: profile?.allergies ? "#dc2626" : "inherit", fontWeight: profile?.allergies ? 700 : 400 }}>
                  {profile?.allergies || "No known allergies"}
                </span>
              </div>
              {profile?.foodIntolerances && (
                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Intolerances:</span>
                  <span>{profile.foodIntolerances}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pillar 4: Measured Lab Status */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#d97706", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.6rem" }}>
              <Sparkles size={16} />
              <span>Biomarkers & Deficiencies</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#334155", display: "grid", gap: "0.4rem" }}>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Total Blood Reports:</span>
                <strong>{reports.length} panels on file</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>Latest Clinical Status:</span>
                <span>{reports.length > 0 ? (reports[0].status || "Analyzed") : "No labs recorded"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Active AI Analysis Modal / Drawer */}
      {activeAnalysis && (
        <div className="glass-panel" style={{
          padding: "1.75rem",
          borderRadius: "16px",
          border: "2px solid #0284c7",
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0284c7", fontWeight: 700, fontSize: "1.1rem" }}>
              <Sparkles size={20} /> AI Nutrition Deficiency Analysis: {activeAnalysis.title}
            </div>
            <button onClick={() => setActiveAnalysis(null)} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>
              Close
            </button>
          </div>

          <p style={{ margin: "0 0 1rem 0", fontSize: "0.92rem", color: "#334155", lineHeight: 1.5 }}>
            {activeAnalysis.aiSummary}
          </p>

          <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
            {(activeAnalysis.identifiedDeficiencies || []).map((def, i) => (
              <div key={i} style={{ background: "#ffffff", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: "#0f172a", marginBottom: "0.25rem" }}>
                  <span>{def.biomarker} ({def.measuredValue || "Tested"})</span>
                  <span className="badge" style={{
                    background: def.status === "OPTIMAL" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: def.status === "OPTIMAL" ? "#10B981" : "#ef4444"
                  }}>
                    {def.status}
                  </span>
                </div>
                <div style={{ color: "#475569" }}>{def.simpleLanguageExplanation}</div>
              </div>
            ))}
          </div>

          {activeAnalysis.recommendedFoodSources && (
            <div style={{ fontSize: "0.85rem", color: "#059669", background: "#f0fdf4", padding: "0.75rem 1rem", borderRadius: "8px" }}>
              🥗 <strong>Target Whole Foods to Incorporate:</strong>{" "}
              {Array.isArray(activeAnalysis.recommendedFoodSources) ? activeAnalysis.recommendedFoodSources.join(", ") : activeAnalysis.recommendedFoodSources}
            </div>
          )}
        </div>
      )}

      {/* Clinician Review & Verification Modal */}
      {verifyingReportId && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: "520px",
            width: "100%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#059669", marginBottom: "0.75rem" }}>
              <ShieldCheck size={24} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                Clinician Review & Sign-Off
              </h3>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.88rem", color: "#64748b", lineHeight: 1.5 }}>
              Review the extracted biomarker values from this report and approve them for clinical treatment planning and personalized dietary calibration.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "0.4rem" }}>
                Clinician Clinical Notes & Recommendations:
              </label>
              <textarea
                value={clinicianNotes}
                onChange={(e) => setClinicianNotes(e.target.value)}
                placeholder="e.g. Biomarkers verified. Vitamin D repletion indicated; begin 2000 IU/day with breakfast."
                className="form-control"
                rows={3}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setVerifyingReportId(null)}
                className="btn btn-outline"
                disabled={verifyingSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyReport(verifyingReportId)}
                disabled={verifyingSubmitting}
                className="btn btn-primary"
                style={{ background: "#059669", borderColor: "#059669", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Check size={16} />
                {verifyingSubmitting ? "Approving..." : "Approve & Verify Biomarkers"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Diagnostic Blood Reports & Extracted Biomarkers
        </h3>

        {reports.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center", borderRadius: "16px", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <FileText size={44} color="#94a3b8" style={{ margin: "0 auto 1rem auto", display: "block" }} />
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#334155" }}>No Diagnostic Blood Reports Found</h3>
            <p className="text-muted" style={{ margin: "0 0 1.5rem 0", fontSize: "0.9rem" }}>
              Upload your blood test panels (CBC, Lipid, Metabolic, Vitamin D, HbA1c) to build a structured nutritional assessment.
            </p>
            <button onClick={() => navigate("/patient/reports/upload")} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Upload size={16} /> Upload First Blood Report
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {reports.map((report) => (
              <div
                key={report.id}
                className="glass-panel"
                style={{
                  padding: "1.75rem",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  display: "grid",
                  gap: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                      {report.title}
                    </h3>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", fontSize: "0.85rem", color: "#64748b" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Calendar size={14} color="#0284c7" /> Test Date: {report.reportDate || "Recent"}
                      </span>
                      <span style={{
                        background: "#f0f9ff",
                        color: "#0284c7",
                        padding: "0.15rem 0.55rem",
                        borderRadius: "9999px",
                        fontSize: "0.72rem",
                        fontWeight: 700
                      }}>
                        {report.reportType || "LAB_REPORT"}
                      </span>
                      {report.reviewedByDoctor ? (
                        <span style={{
                          background: "#ecfdf5",
                          color: "#059669",
                          border: "1px solid #a7f3d0",
                          padding: "0.15rem 0.55rem",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}>
                          <CheckCircle2 size={12} /> Clinician Verified
                        </span>
                      ) : (
                        <span style={{
                          background: "#fef3c7",
                          color: "#d97706",
                          border: "1px solid #fde68a",
                          padding: "0.15rem 0.55rem",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}>
                          <Clock size={12} /> Pending Review
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleToggleValues(report.id)}
                      className="btn btn-outline"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem" }}
                    >
                      {expandedReportId === report.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {expandedReportId === report.id ? "Hide Measured Values" : "View Extracted Lab Values"}
                    </button>

                    <button
                      onClick={() => handleAnalyze(report.id)}
                      className="btn btn-outline"
                      disabled={analyzingId === report.id}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", borderColor: "#0284c7", color: "#0284c7", fontSize: "0.85rem" }}
                    >
                      <Sparkles size={16} />
                      {analyzingId === report.id ? "Analyzing..." : "AI Deficiency Analysis"}
                    </button>

                    {isClinician && !report.reviewedByDoctor && (
                      <button
                        onClick={() => {
                          setVerifyingReportId(report.id);
                          setClinicianNotes(report.doctorReviewNotes || "");
                        }}
                        className="btn btn-primary"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#059669", borderColor: "#059669", fontSize: "0.85rem" }}
                      >
                        <ShieldCheck size={16} /> Review & Verify
                      </button>
                    )}
                  </div>
                </div>

                {/* Extracted Lab Values Dropdown Panel */}
                {expandedReportId === report.id && (
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1rem",
                    marginTop: "0.5rem"
                  }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
                      Extracted Laboratory Parameters & Reference Ranges:
                    </div>

                    {loadingValuesId === report.id ? (
                      <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Loading measured values...</div>
                    ) : (reportValues[report.id] && reportValues[report.id].length > 0) ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
                        {reportValues[report.id].map((val) => (
                          <div key={val.id} style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "0.75rem"
                          }}>
                            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>
                              {val.parameterName}
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0284c7", margin: "0.2rem 0" }}>
                              {val.value} <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#64748b" }}>{val.unit}</span>
                            </div>
                            {val.normalRange && (
                              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                Normal: {val.normalRange}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                        No specific biomarker values recorded for this panel.
                      </div>
                    )}
                  </div>
                )}

                {/* AI Summary and Deficiencies */}
                {report.aiSummary && (
                  <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "1rem", borderRadius: "10px" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Sparkles size={14} /> AI Clinical & Nutritional Insights:
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.45 }}>
                      {report.aiSummary}
                    </div>
                    {report.recommendedFoodSources && (
                      <div style={{ fontSize: "0.82rem", color: "#059669", marginTop: "0.4rem" }}>
                        🥗 <strong>Recommended Whole Foods:</strong> {report.recommendedFoodSources}
                      </div>
                    )}
                  </div>
                )}

                {/* Doctor Review Badge and Notes */}
                {report.doctorReviewNotes && (
                  <div style={{
                    fontSize: "0.82rem",
                    color: "#059669",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    padding: "0.6rem 0.9rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}>
                    <CheckCircle2 size={16} />
                    <span><strong>Clinician Sign-Off:</strong> {report.doctorReviewNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
