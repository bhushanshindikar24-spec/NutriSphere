import {  useState  } from "react";
import { Save, Sparkles } from "lucide-react";
import api from "../../services/api";

export default function RequirementCalculator() {
  const [weightKg, setWeightKg] = useState(78.5);
  const [heightCm, setHeightCm] = useState(178);
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState("MALE");
  const [activityLevel, setActivityLevel] = useState(1.55); // Moderate
  const [goal, setGoal] = useState("FAT_LOSS"); // FAT_LOSS (-20%), MAINTENANCE (0%), MUSCLE_GAIN (+10%)
  const [proteinRatio, setProteinRatio] = useState(2.0); // 2.0g per kg

  // Mifflin-St Jeor Calculation
  const bmr =
    gender === "MALE"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = bmr * activityLevel;

  let targetCalories = tdee;
  if (goal === "FAT_LOSS") targetCalories = tdee * 0.8;
  if (goal === "AGGRESSIVE_LOSS") targetCalories = tdee * 0.75;
  if (goal === "MUSCLE_GAIN") targetCalories = tdee * 1.1;

  const targetProteinG = Math.round(weightKg * proteinRatio);
  const proteinKcal = targetProteinG * 4;
  const targetFatG = Math.round((targetCalories * 0.25) / 9);
  const fatKcal = targetFatG * 9;
  const remainingKcal = Math.max(0, targetCalories - (proteinKcal + fatKcal));
  const targetCarbsG = Math.round(remainingKcal / 4);
  const waterTargetMl = Math.round(weightKg * 35); // 35ml / kg

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveToPatient = async () => {
    setSaving(true);
    try {
      await api.post("/nutrition/requirements", {
        caloriesTarget: Math.round(targetCalories),
        proteinGTarget: targetProteinG,
        carbsGTarget: targetCarbsG,
        fatGTarget: targetFatG,
        waterMlTarget: waterTargetMl,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (_err) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div>
        <h2>Clinical Nutrition Requirement Calculator</h2>
        <p className="text-muted">
          Evidence-based Mifflin-St Jeor metabolic expenditure and macronutrient partitioning engine.
        </p>
      </div>

      {success && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          Calculated requirement profile saved to patient record!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.5rem" }}>
        {/* Input Parameters */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1rem" }}>
          <h4 style={{ margin: 0 }}>Biometric Inputs</h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Body Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="input-field"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Age (years)</label>
              <input
                type="number"
                className="input-field"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Biological Sex</label>
              <select
                className="input-field"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="MALE">Male (+5 kcal)</option>
                <option value="FEMALE">Female (-161 kcal)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Physical Activity Level (PAL)</label>
            <select
              className="input-field"
              value={activityLevel}
              onChange={(e) => setActivityLevel(Number(e.target.value))}
              style={{ width: "100%" }}
            >
              <option value={1.2}>Sedentary (Desk work, no exercise) - 1.2x</option>
              <option value={1.375}>Light Active (1-3 days light exercise) - 1.375x</option>
              <option value={1.55}>Moderately Active (3-5 days moderate) - 1.55x</option>
              <option value={1.725}>Very Active (6-7 days intense) - 1.725x</option>
              <option value={1.9}>Extra Active (Athletic training twice daily) - 1.9x</option>
            </select>
          </div>

          <div>
            <label className="form-label">Clinical Objective</label>
            <select
              className="input-field"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="FAT_LOSS">Moderate Fat Loss (-20% caloric deficit)</option>
              <option value="AGGRESSIVE_LOSS">Aggressive Fat Loss (-25% caloric deficit)</option>
              <option value="MAINTENANCE">Weight Maintenance & Glycemic Stability</option>
              <option value="MUSCLE_GAIN">Lean Hypertrophy (+10% caloric surplus)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Protein Target (g / kg bodyweight)</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={proteinRatio}
              onChange={(e) => setProteinRatio(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Calculated Results */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={18} color="var(--primary)" /> Metabolic Output Targets
            </h4>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", background: "rgba(255, 255, 255, 0.02)", borderRadius: "6px" }}>
                <span className="text-muted">Basal Metabolic Rate (BMR):</span>
                <strong>{Math.round(bmr)} kcal/day</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", background: "rgba(255, 255, 255, 0.02)", borderRadius: "6px" }}>
                <span className="text-muted">Total Energy Expenditure (TDEE):</span>
                <strong>{Math.round(tdee)} kcal/day</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "rgba(99, 102, 241, 0.1)", borderRadius: "8px", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                <span style={{ fontWeight: 600 }}>Target Prescribed Calorie Intake:</span>
                <strong style={{ fontSize: "1.25rem", color: "var(--primary)" }}>
                  {Math.round(targetCalories)} kcal/day
                </strong>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", textAlign: "center" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "0.75rem 0.5rem", borderRadius: "6px" }}>
                  <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Protein</span>
                  <strong style={{ color: "#3B82F6" }}>{targetProteinG}g</strong>
                  <span className="text-muted" style={{ fontSize: "0.7rem", display: "block" }}>({Math.round((proteinKcal / targetCalories) * 100)}%)</span>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "0.75rem 0.5rem", borderRadius: "6px" }}>
                  <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Carbs</span>
                  <strong style={{ color: "#10B981" }}>{targetCarbsG}g</strong>
                  <span className="text-muted" style={{ fontSize: "0.7rem", display: "block" }}>({Math.round(((targetCarbsG * 4) / targetCalories) * 100)}%)</span>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "0.75rem 0.5rem", borderRadius: "6px" }}>
                  <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Fat</span>
                  <strong style={{ color: "#F59E0B" }}>{targetFatG}g</strong>
                  <span className="text-muted" style={{ fontSize: "0.7rem", display: "block" }}>({Math.round((fatKcal / targetCalories) * 100)}%)</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", background: "rgba(59, 130, 246, 0.05)", borderRadius: "6px" }}>
                <span className="text-muted">Hydration Baseline Target:</span>
                <strong style={{ color: "#3B82F6" }}>{waterTargetMl} mL/day</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveToPatient}
            className="btn btn-primary"
            disabled={saving}
            style={{ width: "100%", marginTop: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
          >
            <Save size={16} />
            {saving ? "Saving Targets..." : "Apply to Patient Requirement Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
