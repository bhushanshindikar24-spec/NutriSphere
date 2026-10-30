import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, CheckCircle2, AlertTriangle, ShieldCheck, Calendar, Sparkles, Upload } from "lucide-react";
import api from "../../services/api";

export default function LabProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLongitudinal = async () => {
      try {
        const res = await api.get("/medical/laboratory/my/longitudinal");
        setData(res.data?.data || res.data);
      } catch (_e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLongitudinal();
  }, []);

  if (loading) return <div className="loading-screen">Loading Longitudinal Lab Comparison...</div>;

  if (!data || !data.comparisons || data.comparisons.length === 0) {
    return (
      <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#10B981" }}>
              <TrendingUp size={24} />
            </div>
            <h2 style={{ margin: 0 }}>Longitudinal Blood Report Comparison & AI Progress</h2>
          </div>
          <p className="text-muted" style={{ margin: "0.4rem 0 0 0" }}>
            Visual comparison of your consecutive blood panels across consultations. AI correlates biomarker improvements with your daily diet logs and medications.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "3rem 2rem", borderRadius: "var(--radius-lg)", textAlign: "center", display: "grid", gap: "1.25rem", placeItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(2, 132, 199, 0.12)", color: "#0284c7", display: "grid", placeItems: "center" }}>
            <Upload size={32} />
          </div>
          <div style={{ maxWidth: "540px" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>No Blood Reports Recorded Yet</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55 }}>
              Upload your laboratory blood test panels to automatically detect deficiencies (Vitamin D, B12, Iron, HbA1c, Lipids) and track AI-correlated biomarker improvements over time.
            </p>
          </div>
          <Link to="/patient/upload-report" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Upload size={18} /> Upload Your First Blood Report
          </Link>
        </div>
      </div>
    );
  }

  const improvedCount = data?.comparisons?.filter((c) => c.changeStatus === "IMPROVED").length || 0;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#10B981" }}>
            <TrendingUp size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Longitudinal Blood Report Comparison & AI Progress</h2>
        </div>
        <p className="text-muted" style={{ margin: "0.4rem 0 0 0" }}>
          Visual comparison of your consecutive blood panels across consultations. AI correlates biomarker improvements with your daily diet logs and medications.
        </p>
      </div>

      {/* Comparison Date Banner */}
      <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          {data?.previousReportDate ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={16} color="var(--text-muted)" />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Previous Baseline Panel:</span>
                <strong>{data.previousReportDate}</strong>
              </div>
              <span style={{ color: "var(--text-muted)" }}>➔</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={16} color="#10B981" />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Latest Follow-up Panel:</span>
                <strong style={{ color: "#10B981" }}>{data.latestReportDate}</strong>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Calendar size={16} color="#0284c7" />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Baseline Panel Recorded:</span>
              <strong style={{ color: "#0284c7" }}>{data.latestReportDate || "Active"}</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                (Upload follow-up report to generate historical delta trends)
              </span>
            </div>
          )}
        </div>

        <div style={{ background: improvedCount > 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(2, 132, 199, 0.12)", color: improvedCount > 0 ? "#10B981" : "#0284c7", padding: "0.4rem 0.85rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 700 }}>
          {improvedCount > 0 ? `${improvedCount} Biomarkers Improved` : `${data?.comparisons?.length || 0} Biomarkers Monitored`}
        </div>
      </div>

      {/* Patient Friendly Summary Card */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", border: "1px solid rgba(16, 185, 129, 0.3)", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(2, 132, 199, 0.04) 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>
          <Sparkles size={18} /> AI Progress Analysis & Patient Explanation
        </div>
        <p style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#e2e8f0", lineHeight: 1.55 }}>
          {data?.patientFriendlyInsights}
        </p>

        {/* AI Correlation with Diet */}
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.3rem" }}>
            🥗 Correlation with Your Daily Diet & Medication Records:
          </div>
          <div style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.45 }}>
            {data?.aiDietCorrelation}
          </div>
        </div>

        {/* Improvements Checklist */}
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {(data?.nutritionalImprovements || []).map((imp, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#10B981" }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{imp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Biomarker Trend Cards */}
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Biomarker Trend Breakdown</h3>
        {(data?.comparisons || []).map((item, idx) => {
          const isImproved = item.changeStatus === "IMPROVED";
          const isWorsened = item.changeStatus === "WORSENED";
          const isNewDeficiency = item.changeStatus === "NEW_DEFICIENCY";

          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                border: isImproved
                  ? "1px solid rgba(16, 185, 129, 0.3)"
                  : isWorsened
                  ? "1px solid rgba(239, 68, 68, 0.35)"
                  : "1px solid var(--border-color)",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>{item.parameterName}</h4>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Target Reference Range: {item.normalRange}</span>
                </div>

                {/* Status Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isImproved && (
                    <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <ArrowUpRight size={16} /> IMPROVED VALUE
                    </span>
                  )}
                  {isWorsened && (
                    <span style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.35)", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <ArrowDownRight size={16} /> WORSENED VALUE
                    </span>
                  )}
                  {isNewDeficiency && (
                    <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.35)", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <AlertTriangle size={16} /> NEW DEFICIENCY
                    </span>
                  )}
                  {!isImproved && !isWorsened && !isNewDeficiency && (
                    <span style={{ background: "rgba(2, 132, 199, 0.15)", color: "#0284c7", border: "1px solid rgba(2, 132, 199, 0.35)", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <Minus size={16} /> STABLE BASELINE
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Value Progression Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "0.85rem 1.25rem", borderRadius: "10px" }}>
                <div>
                  <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Previous Test</span>
                  <strong style={{ fontSize: "1.1rem", color: "#94a3b8" }}>{item.previousValue} {item.unit}</strong>
                </div>

                <div style={{ textAlign: "center", color: isImproved ? "#10B981" : "#ef4444", fontWeight: 700, fontSize: "0.85rem" }}>
                  ➔
                </div>

                <div>
                  <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Latest Test</span>
                  <strong style={{ fontSize: "1.1rem", color: isImproved ? "#10B981" : "#ffffff" }}>{item.latestValue} {item.unit}</strong>
                </div>
              </div>

              {/* AI Possible Reason Explanation */}
              <div style={{ fontSize: "0.86rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                🔍 <strong>AI Nutritional Explanation:</strong> {item.aiPossibleExplanation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical Disclaimer */}
      <div style={{ background: "rgba(2, 132, 199, 0.08)", border: "1px solid rgba(2, 132, 199, 0.25)", padding: "1.25rem", borderRadius: "12px", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <ShieldCheck size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
        <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.5 }}>
          <strong>Clinical Supervision Disclaimer:</strong> {data?.clinicalDisclaimer}
          <div style={{ marginTop: "0.4rem", color: "#cbd5e1" }}>
            {data?.clinicalDoctorNotes}
          </div>
        </div>
      </div>
    </div>
  );
}
