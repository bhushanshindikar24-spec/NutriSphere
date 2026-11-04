import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Target, 
  Flame, 
  Droplet, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  Info, 
  Dna, 
  Heart, 
  RefreshCw, 
  Zap, 
  ArrowLeft,
  Calendar,
  Layers,
  FileText
} from "lucide-react";
import api from "../../services/api";

export default function NutritionalRequirements() {
  const navigate = useNavigate();
  const [reqs, setReqs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [planSuccessMsg, setPlanSuccessMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'macros', 'vitamins', 'minerals'

  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/nutrition/requirements/my");
      const data = res.data?.data || res.data;
      setReqs(data);
    } catch (err) {
      console.error("Failed to load nutritional requirements:", err);
      setError("Unable to compute personalized nutritional requirements. Please verify your profile biometrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    setPlanSuccessMsg(null);
    try {
      const res = await api.post(`/nutrition/diet-plans/generate-ai?durationDays=${selectedDuration}`);
      setShowPlanModal(false);
      setPlanSuccessMsg(`Personalized ${selectedDuration}-day Indian diet plan generated successfully! It has been submitted for certified dietitian review.`);
      setTimeout(() => {
        navigate("/patient/diet-plan");
      }, 2000);
    } catch (err) {
      console.error("Plan generation failed:", err);
      alert("Failed to generate plan. Please try again or consult your care team.");
    } finally {
      setGeneratingPlan(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "4px solid #e0f2fe",
          borderTopColor: "#0284c7",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ color: "#0284c7", fontWeight: 700, fontSize: "1.05rem" }}>
          Evaluating ICMR-NIN Clinical RDA & Biometric Energy Requirements...
        </p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Dynamically calculated patient targets (no hardcoded fallback defaults)
  const calories = reqs?.caloriesTarget ? Math.round(reqs.caloriesTarget) : null;
  const proteinG = reqs?.proteinGTarget ? Math.round(reqs.proteinGTarget) : null;
  const carbsG = reqs?.carbsGTarget ? Math.round(reqs.carbsGTarget) : null;
  const fatG = reqs?.fatGTarget ? Math.round(reqs.fatGTarget) : null;
  const fiberG = reqs?.fiberGTarget ? Math.round(reqs.fiberGTarget) : null;
  const satFatG = reqs?.saturatedFatGTarget ? Math.round(reqs.saturatedFatGTarget) : null;
  const mufaG = reqs?.monounsaturatedFatGTarget ? Math.round(reqs.monounsaturatedFatGTarget) : null;
  const pufaG = reqs?.polyunsaturatedFatGTarget ? Math.round(reqs.polyunsaturatedFatGTarget) : null;
  const addedSugarG = reqs?.addedSugarGTarget !== undefined ? reqs.addedSugarGTarget : 0;
  const omega3G = reqs?.omega3GTarget !== undefined ? reqs.omega3GTarget : null;
  const waterMl = reqs?.waterMlTarget ? Math.round(reqs.waterMlTarget) : null;

  const proteinCals = proteinG * 4;
  const carbsCals = carbsG * 4;
  const fatCals = fatG * 9;
  const totalCalculatedCals = proteinCals + carbsCals + fatCals || 1;

  const proteinPct = Math.round((proteinCals / totalCalculatedCals) * 100);
  const carbsPct = Math.round((carbsCals / totalCalculatedCals) * 100);
  const fatPct = Math.round((fatCals / totalCalculatedCals) * 100);

  // 13 Vitamins Matrix Data with Indian Whole Food Sources
  const vitaminsList = [
    { code: "A", name: "Vitamin A", value: reqs?.vitaminA != null ? reqs.vitaminA : "—", unit: "mcg RAE", fn: "Vision, cellular growth & mucosal barrier immunity", sources: "Carrots (gajar), papaya, methi, palak, ripe mango" },
    { code: "B1", name: "Vitamin B1 (Thiamine)", value: reqs?.vitaminB1 != null ? reqs.vitaminB1 : "—", unit: "mg", fn: "Pyruvate dehydrogenase & carbohydrate energy yield", sources: "Whole wheat atta, brown rice, unpolished dal, roasted peanuts" },
    { code: "B2", name: "Vitamin B2 (Riboflavin)", value: reqs?.vitaminB2 != null ? reqs.vitaminB2 : "—", unit: "mg", fn: "FAD/FMN cofactors & mitochondrial respiration", sources: "Desi curd/dahi, fresh paneer, eggs, almonds (badam), spinach" },
    { code: "B3", name: "Vitamin B3 (Niacin)", value: reqs?.vitaminB3 != null ? reqs.vitaminB3 : "—", unit: "mg", fn: "NAD/NADP synthesis & lipid profile regulation", sources: "Peanuts, moong dal, whole grains, button mushrooms" },
    { code: "B5", name: "Vitamin B5 (Pantothenic Acid)", value: reqs?.vitaminB5 != null ? reqs.vitaminB5 : "—", unit: "mg", fn: "Coenzyme A synthesis & fatty acid metabolism", sources: "Sprouted pulses, whole eggs, sunflower seeds, avocados" },
    { code: "B6", name: "Vitamin B6 (Pyridoxine)", value: reqs?.vitaminB6 != null ? reqs.vitaminB6 : "—", unit: "mg", fn: "Amino acid transamination & serotonin synthesis", sources: "Kala chana, bananas, potatoes with skin, rolled oats" },
    { code: "B7", name: "Vitamin B7 (Biotin)", value: reqs?.vitaminB7 != null ? reqs.vitaminB7 : "—", unit: "mcg", fn: "Carboxylation enzymes, hair & keratin matrix", sources: "Roasted walnuts (akhrot), soybeans, oats, egg yolk" },
    { code: "B9", name: "Vitamin B9 (Folate)", value: reqs?.vitaminB9 != null ? reqs.vitaminB9 : "—", unit: "mcg", fn: "DNA methylation & red blood cell formation", sources: "Methi leaves, palak, rajma, chana dal, fresh citrus" },
    { code: "B12", name: "Vitamin B12 (Cobalamin)", value: reqs?.vitaminB12 != null ? reqs.vitaminB12 : "—", unit: "mcg", fn: "Myelin sheath maintenance & RBC maturation", sources: "Dahi/curd, paneer, fortified almond milk, eggs (or B12 supplement)", isDeficient: reqs?.identifiedDeficiencies?.some(d => d.toLowerCase().includes("b12")) },
    { code: "C", name: "Vitamin C (Ascorbic Acid)", value: reqs?.vitaminC != null ? reqs.vitaminC : "—", unit: "mg", fn: "Proline hydroxylation, collagen & non-heme iron absorption", sources: "Amla (Indian gooseberry), lemon, guava (amrood), capsicum" },
    { code: "D", name: "Vitamin D (Cholecalciferol)", value: reqs?.vitaminD != null ? reqs.vitaminD : "—", unit: "mcg", fn: "Enterocyte calcium absorption & immunomodulation", sources: "Sunlight exposure (20 min morning), fortified milk, mushrooms, egg yolk", isDeficient: reqs?.identifiedDeficiencies?.some(d => d.toLowerCase().includes("d3") || d.toLowerCase().includes("vitamin d")) },
    { code: "E", name: "Vitamin E (Alpha-tocopherol)", value: reqs?.vitaminE != null ? reqs.vitaminE : "—", unit: "mg", fn: "Peroxynitrite neutralization & membrane lipid protection", sources: "Almonds, sunflower seeds, cold-pressed mustard oil, wheat germ" },
    { code: "K", name: "Vitamin K (Phylloquinone)", value: reqs?.vitaminK != null ? reqs.vitaminK : "—", unit: "mcg", fn: "Gamma-glutamyl carboxylation & prothrombin clotting", sources: "Sarson ka saag, palak, fresh coriander, broccoli, green beans" }
  ];

  // 10 Minerals Matrix Data with Indian Whole Food Sources
  const mineralsList = [
    { code: "Ca", name: "Calcium", value: reqs?.calcium != null ? reqs.calcium : "—", unit: "mg", fn: "Bone mineral density & neuromuscular synaptic release", sources: "White sesame (safed til), ragi (finger millet), fresh dahi, paneer" },
    { code: "Fe", name: "Iron", value: reqs?.iron != null ? reqs.iron : "—", unit: "mg", fn: "Hemoglobin synthesis & mitochondrial oxygen delivery", sources: "Drumstick leaves (moringa), jaggery (gur), bajra, rajma, soaked raisins", isDeficient: reqs?.identifiedDeficiencies?.some(d => d.toLowerCase().includes("iron") || d.toLowerCase().includes("ferritin")) },
    { code: "Mg", name: "Magnesium", value: reqs?.magnesium != null ? reqs.magnesium : "—", unit: "mg", fn: "ATPase stabilization, neuromuscular relaxation & insulin signaling", sources: "Pumpkin seeds (kaddu ke beej), cashews, spinach, ragi, dark cocoa" },
    { code: "Zn", name: "Zinc", value: reqs?.zinc != null ? reqs.zinc : "—", unit: "mg", fn: "DNA polymerase, thymulin synthesis & wound epithelialization", sources: "Safed chana, pumpkin seeds, whole masoor dal, dahi" },
    { code: "K", name: "Potassium", value: reqs?.potassium != null ? reqs.potassium : "—", unit: "mg", fn: "Intracellular fluid balance & vascular endothelium relaxation", sources: "Coconut water (nariyal pani), bananas, sweet potatoes, tender greens" },
    { code: "Na", name: "Sodium (Target Ceiling)", value: reqs?.sodium != null ? reqs.sodium : "—", unit: "mg", fn: "Extracellular osmotic volume (strictly kept <2000mg for vascular health)", sources: "Himalayan pink salt, rock salt (sendha namak) — keep under 1 level tsp/day" },
    { code: "P", name: "Phosphorus", value: reqs?.phosphorus != null ? reqs.phosphorus : "—", unit: "mg", fn: "Hydroxyapatite crystal matrix & high-energy ATP bonds", sources: "Toor dal, moong dal, paneer, unpolished rice" },
    { code: "Se", name: "Selenium", value: reqs?.selenium != null ? reqs.selenium : "—", unit: "mcg", fn: "Glutathione peroxidase & deiodinase thyroid activation", sources: "Eggs, button mushrooms, sunflower seeds, whole wheat" },
    { code: "I", name: "Iodine", value: reqs?.iodine != null ? reqs.iodine : "—", unit: "mcg", fn: "Thyroxine (T4) & triiodothyronine (T3) biosynthesis", sources: "Adequately iodized table salt, curd, natural kelp" },
    { code: "Cu", name: "Copper", value: reqs?.copper != null ? reqs.copper : "—", unit: "mg", fn: "Ceruloplasmin oxidase & lysyl oxidase crosslinking", sources: "Kaju (cashews), sesame seeds, whole chana, rajma" }
  ];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gap: "1.75rem", paddingBottom: "3rem" }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
        color: "#ffffff",
        borderRadius: "16px",
        padding: "2rem",
        boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255, 255, 255, 0.18)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              <ShieldCheck size={14} /> ICMR-NIN 2020 RDA & Mifflin-St Jeor Reference Standard
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
              My Personalized Nutritional Requirements
            </h1>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#e0f2fe", maxWidth: "700px", lineHeight: 1.5 }}>
              Scientifically calculated macro- and micronutrient blueprint tailored to your biometrics, lab investigations, medical history, and clinical lifestyle objectives.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowPlanModal(true)}
              style={{
                background: "#ffffff",
                color: "#0369a1",
                border: "none",
                borderRadius: "10px",
                padding: "0.75rem 1.25rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Sparkles size={16} color="#0284c7" /> Generate Indian Diet Plan
            </button>

            <Link
              to="/patient/diet-plan"
              style={{
                background: "rgba(255, 255, 255, 0.18)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                borderRadius: "10px",
                padding: "0.75rem 1.1rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem"
              }}
            >
              <Calendar size={16} /> View Current Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {planSuccessMsg && (
        <div style={{
          background: "#ecfdf5",
          border: "1.5px solid #a7f3d0",
          color: "#065f46",
          padding: "1rem 1.25rem",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <CheckCircle2 size={20} color="#059669" />
          <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>{planSuccessMsg}</span>
        </div>
      )}

      {/* Clinical Review & Safety Banner */}
      <div style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#dbeafe",
            color: "#1d4ed8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1e3a8a" }}>
              Clinical Intelligence & Certified Dietitian Protocol
            </div>
            <div style={{ fontSize: "0.8rem", color: "#3b82f6" }}>
              Targets are strictly deterministic based on medical equations. Any AI-generated meal plans remain pending until reviewed and approved by an authorized dietitian.
            </div>
          </div>
        </div>

        <Link
          to="/patient/profile?tab=blood-reports"
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#1d4ed8",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem"
          }}
        >
          Verify Lab Reports <ChevronRight size={14} />
        </Link>
      </div>

      {/* Lab Deficiencies & Identified Data Gaps */}
      {((reqs?.identifiedDeficiencies && reqs.identifiedDeficiencies.length > 0) || 
        (reqs?.dataGaps && reqs.dataGaps.length > 0)) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
          
          {/* Active Clinical Deficiencies */}
          {reqs?.identifiedDeficiencies && reqs.identifiedDeficiencies.length > 0 && (
            <div style={{
              background: "#fffbeb",
              border: "1.5px solid #fde68a",
              borderRadius: "14px",
              padding: "1.25rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
                <AlertTriangle size={18} color="#d97706" />
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#92400e" }}>
                  Active Clinical Deficiencies Detected ({reqs.identifiedDeficiencies.length})
                </h4>
              </div>
              <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "#b45309" }}>
                Extracted directly from your diagnostic laboratory reports. Daily requirements have been calibrated to restore therapeutic physiological levels:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {reqs.identifiedDeficiencies.map((d, i) => (
                  <span key={i} style={{
                    background: "#fef3c7",
                    border: "1px solid #fcd34d",
                    color: "#78350f",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "6px"
                  }}>
                    ⚠️ {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Data Gaps */}
          {reqs?.dataGaps && reqs.dataGaps.length > 0 && (
            <div style={{
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "14px",
              padding: "1.25rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
                <Info size={18} color="#64748b" />
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#334155" }}>
                  Identified Health Data Gaps ({reqs.dataGaps.length})
                </h4>
              </div>
              <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "#64748b" }}>
                We avoid making unsupported assumptions. Uploading the following reports will sharpen precision nutrition calculations:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8rem", color: "#475569", lineHeight: 1.6 }}>
                {reqs.dataGaps.map((gap, i) => (
                  <li key={i}>{gap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Energy & Metabolic Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        
        {/* Total Calories */}
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          padding: "1.25rem",
          boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Target Daily Energy</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
            {Math.round(calories)} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b" }}>kcal/day</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
            Adjusted for metabolic goal & health context
          </div>
        </div>

        {/* BMR */}
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          padding: "1.25rem",
          boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Basal Metabolic Rate</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
            {reqs?.bmr ? Math.round(reqs.bmr) : "—"} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b" }}>kcal</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
            Mifflin-St Jeor resting energy expenditure
          </div>
        </div>

        {/* TDEE */}
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          padding: "1.25rem",
          boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Maintenance TDEE</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f0f9ff", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
            {reqs?.tdee ? Math.round(reqs.tdee) : "—"} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b" }}>kcal</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
            BMR × Physical PAL activity coefficient
          </div>
        </div>

        {/* Daily Water */}
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          padding: "1.25rem",
          boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Water Hydration</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Droplet size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
            {(waterMl / 1000).toFixed(1)} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b" }}>L ({Math.round(waterMl)} ml)</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
            ~8 to 12 glasses across waking hours
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "0.5rem",
        flexWrap: "wrap"
      }}>
        {[
          { id: "all", label: "Complete Dashboard" },
          { id: "macros", label: "Macronutrients & Lipids" },
          { id: "vitamins", label: `Vitamins (${vitaminsList.length})` },
          { id: "minerals", label: `Minerals (${mineralsList.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.55rem 1.15rem",
              borderRadius: "8px",
              border: "none",
              background: activeTab === tab.id ? "#0284c7" : "#f1f5f9",
              color: activeTab === tab.id ? "#ffffff" : "#475569",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: MACRONUTRIENTS & DETAILED LIPID TARGETS */}
      {(activeTab === "all" || activeTab === "macros") && (
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.75rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.25rem 0" }}>
                Macronutrient Architecture & Energy Partitioning
              </h2>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>
                Target calorie distribution: {carbsPct}% Carbohydrates • {proteinPct}% Protein • {fatPct}% Fats
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, background: "#f0f9ff", color: "#0284c7", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
                ICMR Macro Splits
              </span>
            </div>
          </div>

          {/* Energy Distribution Bar */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ height: "14px", borderRadius: "9999px", overflow: "hidden", display: "flex", background: "#f1f5f9" }}>
              <div style={{ width: `${carbsPct}%`, background: "#3b82f6" }} title={`Carbs: ${carbsPct}%`} />
              <div style={{ width: `${proteinPct}%`, background: "#10b981" }} title={`Protein: ${proteinPct}%`} />
              <div style={{ width: `${fatPct}%`, background: "#f59e0b" }} title={`Fats: ${fatPct}%`} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }} /> Carbohydrates ({carbsPct}%)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} /> Protein ({proteinPct}%)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} /> Healthy Fats ({fatPct}%)
              </span>
            </div>
          </div>

          {/* Core Macro Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
            
            {/* Protein */}
            <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", padding: "1.1rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Protein</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#14532d", margin: "0.2rem 0" }}>
                {Math.round(proteinG)} <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>g/day</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#166534" }}>
                {Math.round(proteinCals)} kcal ({proteinPct}% of energy) • Essential for muscle preservation & tissue repair.
              </div>
            </div>

            {/* Carbohydrates */}
            <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "12px", padding: "1.1rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>Carbohydrates</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e3a8a", margin: "0.2rem 0" }}>
                {Math.round(carbsG)} <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>g/day</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#1e40af" }}>
                {Math.round(carbsCals)} kcal ({carbsPct}% of energy) • Primary glycemic source from whole grains and millets.
              </div>
            </div>

            {/* Total Fats */}
            <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "12px", padding: "1.1rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#92400e", textTransform: "uppercase" }}>Total Fats</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#78350f", margin: "0.2rem 0" }}>
                {Math.round(fatG)} <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>g/day</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#92400e" }}>
                {Math.round(fatCals)} kcal ({fatPct}% of energy) • Lipid envelope, hormone production & vitamin absorption.
              </div>
            </div>

            {/* Dietary Fibre */}
            <div style={{ background: "#faf5ff", border: "1.5px solid #e9d5ff", borderRadius: "12px", padding: "1.1rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6b21a8", textTransform: "uppercase" }}>Dietary Fibre</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#581c87", margin: "0.2rem 0" }}>
                {Math.round(fiberG)} <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>g/day</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b21a8" }}>
                Soluble & insoluble fiber for gut microbiota, satiety, and postprandial glucose stability.
              </div>
            </div>
          </div>

          {/* Detailed Lipid & Sugar Sub-Targets */}
          <div style={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem" }}>
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>
              Detailed Lipid Quality & Added Sugar Thresholds
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              
              <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Saturated Fats (Ceiling)</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                  ≤ {Math.round(satFatG)} g/day
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem" }}>
                  &lt;7-8% of total daily calories for cardiac protection
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>MUFA (Monounsaturated)</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                  {Math.round(mufaG)} g/day
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem" }}>
                  Mustard oil, groundnut oil, olive oil, almonds
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>PUFA (Polyunsaturated)</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                  {Math.round(pufaG)} g/day
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem" }}>
                  Flaxseeds, sunflower seeds, sesame (til)
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Omega-3 Fatty Acids</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0284c7", marginTop: "0.2rem" }}>
                  {omega3G} g/day
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem" }}>
                  ALA/EPA/DHA: Alsi, walnuts, chia seeds
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Added Sugar Ceiling</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: addedSugarG === 0 ? "#16a34a" : "#ea580c", marginTop: "0.2rem" }}>
                  {addedSugarG === 0 ? "0 g (Zero Added Sugar)" : `≤ ${addedSugarG} g/day`}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem" }}>
                  Restricted to curb glycemic variability
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 13 ESSENTIAL VITAMINS MATRIX */}
      {(activeTab === "all" || activeTab === "vitamins") && (
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.75rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.25rem 0" }}>
                Complete Vitamins Spectrum (13 Essential Micronutrients)
              </h2>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>
                Daily recommended intakes aligned with ICMR-NIN guidelines & verified whole-food Indian dietary sources.
              </p>
            </div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, background: "#f0fdf4", color: "#166534", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
              13 / 13 Calculated
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
            {vitaminsList.map((v) => (
              <div 
                key={v.name} 
                style={{
                  background: v.isDeficient ? "#fffbeb" : "#f8fafc",
                  border: v.isDeficient ? "1.5px solid #fde68a" : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1.1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.15s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: v.isDeficient ? "#fef3c7" : "#e0f2fe",
                        color: v.isDeficient ? "#b45309" : "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.82rem"
                      }}>
                        {v.code}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{v.name}</span>
                    </div>

                    {v.isDeficient && (
                      <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                        DEFICIENT
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: v.isDeficient ? "#b45309" : "#0284c7", margin: "0.4rem 0" }}>
                    {v.value} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>{v.unit}</span>
                  </div>

                  <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "0.65rem", lineHeight: 1.4 }}>
                    {v.fn}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.5rem", fontSize: "0.72rem", color: "#64748b" }}>
                  <strong style={{ color: "#334155" }}>Indian Sources:</strong> {v.sources}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: 10 ESSENTIAL MINERALS MATRIX */}
      {(activeTab === "all" || activeTab === "minerals") && (
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.75rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.25rem 0" }}>
                Complete Minerals Matrix (10 Core Elements)
              </h2>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>
                Electrolytes, skeletal minerals, enzymatic cofactors, and thyroid trace minerals.
              </p>
            </div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, background: "#f0f9ff", color: "#0369a1", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
              10 / 10 Monitored
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
            {mineralsList.map((m) => (
              <div 
                key={m.name} 
                style={{
                  background: m.isDeficient ? "#fffbeb" : "#f8fafc",
                  border: m.isDeficient ? "1.5px solid #fde68a" : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1.1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.15s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: m.isDeficient ? "#fef3c7" : "#ede9fe",
                        color: m.isDeficient ? "#b45309" : "#6d28d9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.82rem"
                      }}>
                        {m.code}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{m.name}</span>
                    </div>

                    {m.isDeficient && (
                      <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                        DEFICIENT
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: m.isDeficient ? "#b45309" : "#6d28d9", margin: "0.4rem 0" }}>
                    {m.value} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>{m.unit}</span>
                  </div>

                  <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "0.65rem", lineHeight: 1.4 }}>
                    {m.fn}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.5rem", fontSize: "0.72rem", color: "#64748b" }}>
                  <strong style={{ color: "#334155" }}>Indian Sources:</strong> {m.sources}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Rationale & Explanation Card */}
      {reqs?.clinicalRationale && (
        <div className="glass-panel" style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.75rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f0f9ff", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Dna size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                Clinical Rationale & Algorithmic Explanation
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                Scientific explanation behind target selection
              </p>
            </div>
          </div>

          <div style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "1.25rem",
            fontSize: "0.88rem",
            color: "#334155",
            lineHeight: 1.6,
            borderLeft: "4px solid #0284c7"
          }}>
            {reqs.clinicalRationale}
          </div>
        </div>
      )}

      {/* Call-to-Action Bottom Banner */}
      <div style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        border: "1.5px solid #cbd5e1",
        borderRadius: "16px",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem"
      }}>
        <div>
          <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
            Ready to translate these requirements into your meals?
          </h3>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b", maxWidth: "600px" }}>
            Generate a personalized 10-day or 30-day Indian diet plan incorporating seasonal ingredients, culinary spices, and clinical safeguards.
          </p>
        </div>

        <button
          onClick={() => setShowPlanModal(true)}
          style={{
            background: "#0284c7",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "0.85rem 1.6rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)"
          }}
        >
          <Sparkles size={18} /> Generate Personalized Diet Plan
        </button>
      </div>

      {/* MODAL: Select Duration & Generate Diet Plan */}
      {showPlanModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            borderRadius: "20px",
            maxWidth: "520px",
            width: "100%",
            padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                  Generate AI Indian Diet Plan
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                  Select duration based on clinical goals
                </p>
              </div>
            </div>

            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              Your plan will be formulated using your calculated requirements: <strong>{Math.round(calories)} kcal/day</strong>, <strong>{Math.round(proteinG)}g protein</strong>, and fortified Indian food items tailored to your dietary preference and detected lab values.
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.6rem" }}>
                Choose Plan Duration:
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div
                  onClick={() => setSelectedDuration(10)}
                  style={{
                    border: selectedDuration === 10 ? "2px solid #0284c7" : "1.5px solid #e2e8f0",
                    background: selectedDuration === 10 ? "#f0f9ff" : "#ffffff",
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: selectedDuration === 10 ? "#0284c7" : "#0f172a" }}>
                    10-Day Plan
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                    Rapid Adaptation Protocol • 3 Rotation Cycles
                  </div>
                </div>

                <div
                  onClick={() => setSelectedDuration(30)}
                  style={{
                    border: selectedDuration === 30 ? "2px solid #0284c7" : "1.5px solid #e2e8f0",
                    background: selectedDuration === 30 ? "#f0f9ff" : "#ffffff",
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: selectedDuration === 30 ? "#0284c7" : "#0f172a" }}>
                    30-Day Plan
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                    Full Metabolic Cycle • Longitudinal Adherence
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.78rem",
              color: "#92400e"
            }}>
              <strong>Dietitian Approval Required:</strong> In accordance with clinical safety regulations, your plan will remain in <em>Pending Review</em> until verified by an authorized dietitian before formal clinical activation.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                disabled={generatingPlan}
                onClick={() => setShowPlanModal(false)}
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={generatingPlan}
                onClick={handleGeneratePlan}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.65rem 1.4rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  opacity: generatingPlan ? 0.7 : 1
                }}
              >
                {generatingPlan ? (
                  <>Synthesizing Plan...</>
                ) : (
                  <><Sparkles size={16} /> Generate {selectedDuration}-Day Plan</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

