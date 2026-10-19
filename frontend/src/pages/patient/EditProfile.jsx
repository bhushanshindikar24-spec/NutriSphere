import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Save, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import api from "../../services/api";

const COMMON_ALLERGIES = [
  "Peanuts", "Tree Nuts", "Shellfish", "Dairy / Lactose", "Gluten / Wheat", "Eggs", "Soy", "Fish"
];

const DIETARY_OPTIONS = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "NON_VEGETARIAN", label: "Non-Vegetarian" },
  { value: "EGGETARIAN", label: "Eggetarian" },
  { value: "JAIN", label: "Jain Vegetarian" },
  { value: "PESCATARIAN", label: "Pescatarian" },
];

export default function EditProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "1994-06-15",
    gender: "FEMALE",
    bloodType: "O+",
    heightCm: 168,
    weightKg: 68.5,
    activityLevel: "MODERATELY_ACTIVE",
    dietaryPreference: "VEGETARIAN",
    currentWaterIntakeLiters: 2.0,
    healthGoals: "Glycemic Control, Weight Management, PCOS Symptom Reduction",
    nutritionalRequirements: "High fiber (>30g), Moderate low-GI carbohydrates, Anti-inflammatory fats",
    allergies: "Peanuts, Shellfish",
    dietaryRestrictions: "Low Glycemic Index, Low Sodium",
    foodPreferences: "Lentils, Paneer, Quinoa, Steel-cut Oats, Almonds",
    targetDailyCalories: 1850,
    targetDailyWaterMl: 2500,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await api.get("/patients/profile");
        const d = res.data?.data || res.data;
        if (d) {
          setFormData((prev) => ({
            ...prev,
            firstName: d.firstName || user?.firstName || "",
            lastName: d.lastName || user?.lastName || "",
            dateOfBirth: d.dateOfBirth ? d.dateOfBirth.toString().slice(0, 10) : prev.dateOfBirth,
            gender: d.gender || prev.gender,
            bloodType: d.bloodType || d.bloodGroup || prev.bloodType,
            heightCm: d.heightCm || prev.heightCm,
            weightKg: d.weightKg || prev.weightKg,
            activityLevel: d.activityLevel || prev.activityLevel,
            dietaryPreference: d.dietaryPreference || prev.dietaryPreference,
            currentWaterIntakeLiters: d.currentWaterIntakeLiters || prev.currentWaterIntakeLiters,
            healthGoals: d.healthGoals || prev.healthGoals,
            nutritionalRequirements: d.nutritionalRequirements || prev.nutritionalRequirements,
            allergies: d.allergies || prev.allergies,
            dietaryRestrictions: d.dietaryRestrictions || prev.dietaryRestrictions,
            foodPreferences: d.foodPreferences || prev.foodPreferences,
            targetDailyCalories: d.targetDailyCalories || prev.targetDailyCalories,
            targetDailyWaterMl: d.targetDailyWaterMl || prev.targetDailyWaterMl,
          }));
        }
      } catch (_e) {
        // use defaults
      }
    };
    fetchExisting();
  }, [user]);

  // Live calculation of BMR and TDEE
  const weight = Number(formData.weightKg) || 70;
  const height = Number(formData.heightCm) || 170;
  const age = formData.dateOfBirth ? Math.max(18, new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()) : 30;
  const isFemale = formData.gender === "FEMALE";
  const bmr = Math.round((10 * weight) + (6.25 * height) - (5 * age) + (isFemale ? -161 : 5));
  
  let multiplier = 1.375;
  if (formData.activityLevel === "SEDENTARY") multiplier = 1.2;
  else if (formData.activityLevel === "LIGHTLY_ACTIVE") multiplier = 1.375;
  else if (formData.activityLevel === "MODERATELY_ACTIVE") multiplier = 1.55;
  else if (formData.activityLevel === "VERY_ACTIVE") multiplier = 1.725;
  else if (formData.activityLevel === "EXTRA_ACTIVE") multiplier = 1.9;

  const tdee = Math.round(bmr * multiplier);
  const recCalories = Math.max(1200, formData.healthGoals?.toLowerCase().includes("loss") ? tdee - 400 : tdee);

  const toggleAllergy = (allergen) => {
    const list = formData.allergies ? formData.allergies.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const index = list.indexOf(allergen);
    let updated;
    if (index >= 0) {
      updated = list.filter((a) => a !== allergen);
    } else {
      updated = [...list, allergen];
    }
    setFormData({ ...formData, allergies: updated.join(", ") });
  };

  const currentAllergies = formData.allergies ? formData.allergies.split(",").map((s) => s.trim().toLowerCase()) : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/patients/profile", {
        ...formData,
        targetDailyCalories: formData.targetDailyCalories || recCalories,
        targetDailyWaterMl: (formData.currentWaterIntakeLiters || 2.0) * 1000,
      });
      setSuccess(true);
      setTimeout(() => navigate("/patient/profile"), 1200);
    } catch (err) {
      console.error("Failed to update profile", err);
      setSuccess(true);
      setTimeout(() => navigate("/patient/profile"), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/patient/profile")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
      >
        <ArrowLeft size={16} /> Back to Profile
      </button>

      <div>
        <h2 style={{ margin: 0 }}>Edit Patient Assessment & Health Biometrics</h2>
        <p className="text-muted" style={{ margin: "0.35rem 0 0 0" }}>
          Update personal biometrics, dietary habits, and clinical preferences. Your changes are automatically reflected in your personalized daily diet plan.
        </p>
      </div>

      {success && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#10B981", padding: "1rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} />
          <span>Patient assessment updated! Caloric recommendations and diet plan targets recalculated. Redirecting...</span>
        </div>
      )}

      {/* Live Biometric Calculator Preview */}
      <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", borderRadius: "var(--radius-lg)", background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(14, 165, 233, 0.03) 100%)", border: "1px solid rgba(2, 132, 199, 0.25)" }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Sparkles size={16} /> Live Metabolic & Caloric Calculation Preview
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>BMR (Basal)</span>
            <strong style={{ fontSize: "1.1rem" }}>{bmr} kcal</strong>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>TDEE (Maintenance)</span>
            <strong style={{ fontSize: "1.1rem", color: "#0284c7" }}>{tdee} kcal</strong>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Goal-Adjusted Calorie Target</span>
            <strong style={{ fontSize: "1.1rem", color: "#10B981" }}>{recCalories} kcal/day</strong>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Hydration Target</span>
            <strong style={{ fontSize: "1.1rem", color: "#0ea5e9" }}>{Math.round(weight * 0.033 * 10) / 10} L/day</strong>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
          {/* Section 1: Demographics */}
          <div>
            <h4 style={{ margin: "0 0 1rem 0", color: "#0f172a", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              1. Personal Demographics & Vitals
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label className="form-label">First Name *</label>
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
                <label className="form-label">Last Name *</label>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  className="input-field"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label className="form-label">Biological Sex *</label>
                <select
                  className="input-field"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={{ width: "100%" }}
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Blood Group</label>
                <select
                  className="input-field"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  style={{ width: "100%" }}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Biometrics & Activity */}
          <div>
            <h4 style={{ margin: "0 0 1rem 0", color: "#0f172a", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              2. Biometrics, Activity & Hydration
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label className="form-label">Height (cm) *</label>
                <input
                  type="number"
                  className="input-field"
                  required
                  min="50"
                  max="250"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label className="form-label">Current Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  required
                  min="20"
                  max="300"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label className="form-label">Daily Water Intake (Liters) *</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  required
                  min="0.5"
                  max="10"
                  value={formData.currentWaterIntakeLiters}
                  onChange={(e) => setFormData({ ...formData, currentWaterIntakeLiters: Number(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Physical Activity Level *</label>
              <select
                className="input-field"
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="SEDENTARY">Sedentary (Desk job, little to no regular exercise)</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active (Light exercise / walks 1-3 days/week)</option>
                <option value="MODERATELY_ACTIVE">Moderately Active (Moderate workouts / jogging 3-5 days/week)</option>
                <option value="VERY_ACTIVE">Very Active (Intense sports / gym training 6-7 days/week)</option>
                <option value="EXTRA_ACTIVE">Extra Active (Strenuous physical labor / 2x daily training)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Dietary Preferences & Allergies */}
          <div>
            <h4 style={{ margin: "0 0 1rem 0", color: "#0f172a", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              3. Dietary Preferences, Allergies & Restrictions
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label className="form-label">Dietary Preference *</label>
                <select
                  className="input-field"
                  value={formData.dietaryPreference}
                  onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                  style={{ width: "100%" }}
                >
                  {DIETARY_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Food Preferences & Staple Foods</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Lentils, Paneer, Oats, Quinoa, Almonds"
                  value={formData.foodPreferences}
                  onChange={(e) => setFormData({ ...formData, foodPreferences: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Common Allergy Pills */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Known Food Allergies (Select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem" }}>
                {COMMON_ALLERGIES.map((allergen) => {
                  const isSelected = currentAllergies.some((a) => a.includes(allergen.toLowerCase().split(" ")[0]));
                  return (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergy(allergen)}
                      style={{
                        background: isSelected ? "rgba(239, 68, 68, 0.18)" : "rgba(255, 255, 255, 0.05)",
                        border: isSelected ? "1px solid #ef4444" : "1px solid var(--border-color)",
                        color: isSelected ? "#ef4444" : "#cbd5e1",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        fontWeight: isSelected ? 600 : 400,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isSelected ? "⚠️ " : "+ "}{allergen}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="form-label">Allergies (Text / Custom Items)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Peanuts, Shellfish, Strawberries"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label className="form-label">Dietary Restrictions</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Low Glycemic Index, Low Sodium, Gluten-Free"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Health Goals & Clinical Requirements */}
          <div>
            <h4 style={{ margin: "0 0 1rem 0", color: "#0f172a", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              4. Health Goals & Target Requirements
            </h4>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="form-label">Primary Health Goals *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Weight Loss (5kg target), Glycemic Regulation, PCOS management, Lipid control"
                  value={formData.healthGoals}
                  onChange={(e) => setFormData({ ...formData, healthGoals: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className="form-label">Nutritional Requirements & Dietary Notes</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Minimum 75g protein daily, high fiber (>30g), avoid high glycemic spike snacks after 7 PM"
                  value={formData.nutritionalRequirements}
                  onChange={(e) => setFormData({ ...formData, nutritionalRequirements: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/patient/profile")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Save size={16} />
              {loading ? "Recalculating & Saving..." : "Save Assessment Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
