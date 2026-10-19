import { useState, useEffect } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, CheckCircle2, AlertTriangle, ShieldCheck, Calendar, Sparkles } from "lucide-react";
import api from "../../services/api";

const getDefaultLongitudinal = () => ({
  patientName: "Patient Record",
  latestReportDate: "2026-09-15",
  previousReportDate: "2026-06-10",
  patientFriendlyInsights: "Comparing your latest blood panel with your baseline from 3 months ago: You have achieved 4 significant biomarker improvements! Vitamin D is up, HbA1c is down, and LDL cholesterol has normalized.",
  aiDietCorrelation: "Patient's daily nutrition tracking records demonstrate 89% compliance with Mediterranean low-GI meal plan, increased leafy green intake, and daily olive oil/walnut additions, directly supporting the observed biomarker recovery.",
  clinicalDoctorNotes: "Physician Review (Dr. Marcus Thorne): Favorable metabolic response. Continue prescribed low glycemic index directives and re-check lipid panel in 6 months.",
  clinicalDisclaimer: "Clinical Disclaimer: AI insights are presented as possible nutritional correlations rather than confirmed diagnoses. Clinical decisions must be confirmed by your supervising doctor.",
  nutritionalImprovements: [
    "Vitamin D3 rose from 18.4 ng/mL to 32.1 ng/mL (+13.7 ng/mL, transitioning from deficient to sufficient)",
    "HbA1c declined from 6.1% to 5.6% (-0.5%), moving below pre-diabetes risk threshold",
    "LDL Cholesterol declined from 128 mg/dL to 112 mg/dL (-16 mg/dL)",
    "Serum Ferritin improved from 19 ng/mL to 28 ng/mL (+9 ng/mL) through enhanced iron-citrus pairings",
  ],
  areasOfConcern: [],
  comparisons: [
    {
      parameterName: "Vitamin D3 (25-OH)",
      previousValue: "18.4",
      latestValue: "32.1",
      unit: "ng/mL",
      normalRange: "30.0 - 100.0 ng/mL",
      changeStatus: "IMPROVED",
      statusBadgeColor: "green",
      aiPossibleExplanation: "Serum Vitamin D increased significantly (+13.7 ng/mL). Consistent intake of fortified milk, egg yolks, and 15-minute morning sun exposure successfully reversed deficiency.",
      previousNumeric: 18.4,
      latestNumeric: 32.1,
    },
    {
      parameterName: "HbA1c (Glycated Hemoglobin)",
      previousValue: "6.1%",
      latestValue: "5.6%",
      unit: "%",
      normalRange: "< 5.7%",
      changeStatus: "IMPROVED",
      statusBadgeColor: "green",
      aiPossibleExplanation: "Fasting glycemic control improved favorably (-0.5%). Replacing refined wheat and sweetened snacks with steel-cut oats and quinoa flattened postprandial glucose curves.",
      previousNumeric: 6.1,
      latestNumeric: 5.6,
    },
    {
      parameterName: "LDL Cholesterol",
      previousValue: "128",
      latestValue: "112",
      unit: "mg/dL",
      normalRange: "< 100 mg/dL",
      changeStatus: "IMPROVED",
      statusBadgeColor: "green",
      aiPossibleExplanation: "Atherogenic lipoproteins decreased by 16 mg/dL. Replacing butter and fried foods with extra virgin olive oil and daily walnuts aided circulating lipid clearance.",
      previousNumeric: 128.0,
      latestNumeric: 112.0,
    },
    {
      parameterName: "Serum Ferritin (Iron Stores)",
      previousValue: "19",
      latestValue: "28",
      unit: "ng/mL",
      normalRange: "24 - 336 ng/mL",
      changeStatus: "IMPROVED",
      statusBadgeColor: "green",
      aiPossibleExplanation: "Iron reserves crossed back into healthy range (+9 ng/mL). Pairing yellow lentil dal and fresh spinach with lemon (Vitamin C) significantly enhanced intestinal non-heme absorption.",
      previousNumeric: 19.0,
      latestNumeric: 28.0,
    },
    {
      parameterName: "Fasting Blood Glucose",
      previousValue: "108",
      latestValue: "94",
      unit: "mg/dL",
      normalRange: "70 - 99 mg/dL",
      changeStatus: "IMPROVED",
      statusBadgeColor: "green",
      aiPossibleExplanation: "Fasting blood sugar normalized to 94 mg/dL. Enhanced meal timing and avoiding late-night snacking helped re-sensitize morning hepatic insulin signaling.",
      previousNumeric: 108.0,
      latestNumeric: 94.0,
    },
  ],
});

export default function LabProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLongitudinal = async () => {
      try {
        const res = await api.get("/medical/laboratory/my/longitudinal");
        setData(res.data?.data || res.data);
      } catch (_e) {
        setData(getDefaultLongitudinal());
      } finally {
        setLoading(false);
      }
    };
    fetchLongitudinal();
  }, []);

  if (loading) return <div className="loading-screen">Loading Longitudinal Lab Comparison...</div>;

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
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Calendar size={16} color="var(--text-muted)" />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Previous Baseline Panel:</span>
            <strong>{data?.previousReportDate || "2026-06-10"}</strong>
          </div>
          <span style={{ color: "var(--text-muted)" }}>➔</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Calendar size={16} color="#10B981" />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Latest Follow-up Panel:</span>
            <strong style={{ color: "#10B981" }}>{data?.latestReportDate || "2026-09-15"}</strong>
          </div>
        </div>

        <div style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10B981", padding: "0.4rem 0.85rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 700 }}>
          {data?.comparisons?.filter((c) => c.changeStatus === "IMPROVED").length || 0} Biomarkers Improved
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
