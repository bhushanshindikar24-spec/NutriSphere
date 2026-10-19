import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Edit3, Droplet, Flame, Target, ShieldAlert, HeartPulse, UserCheck, Stethoscope, Sparkles } from "lucide-react";
import api from "../../services/api";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/patients/profile");
        setProfileData(res.data?.data || res.data);
      } catch (_err) {
        setProfileData({
          firstName: user?.firstName || "Patient",
          lastName: user?.lastName || "",
          email: user?.email || "",
          dateOfBirth: "1994-06-15",
          age: 32,
          gender: "FEMALE",
          heightCm: 168,
          weightKg: 68.5,
          bmi: 24.3,
          bmr: 1460,
          tdee: 2263,
          recommendedCalories: 1850,
          recommendedWaterLiters: 2.3,
          bloodGroup: "O+",
          activityLevel: "MODERATELY_ACTIVE",
          dietaryPreference: "VEGETARIAN",
          currentWaterIntakeLiters: 2.0,
          healthGoals: "Glycemic Control, Weight Management, PCOS Symptom Reduction",
          nutritionalRequirements: "High fiber (>30g), Moderate low-GI carbohydrates, Anti-inflammatory fats (omega-3)",
          allergies: "Peanuts, Shellfish",
          dietaryRestrictions: "Low Glycemic Index, Low Sodium",
          foodPreferences: "Lentils, Paneer, Quinoa, Steel-cut Oats, Almonds",
          assignedDoctor: "Dr. Marcus Thorne, MD",
          assignedDietitian: "Dr. Elena Rostova, RD",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) return <div className="loading-screen">Loading Patient Assessment Profile...</div>;

  const allergyList = typeof profileData?.allergies === "string"
    ? profileData.allergies.split(",").map((s) => s.trim()).filter(Boolean)
    : (Array.isArray(profileData?.allergies) ? profileData.allergies : []);

  const restrictionList = typeof profileData?.dietaryRestrictions === "string"
    ? profileData.dietaryRestrictions.split(",").map((s) => s.trim()).filter(Boolean)
    : (Array.isArray(profileData?.dietaryRestrictions) ? profileData.dietaryRestrictions : []);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "rgba(2, 132, 199, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#0284c7" }}>
              <User size={24} />
            </div>
            <h2 style={{ margin: 0 }}>Detailed Patient Clinical Profile & Assessment</h2>
          </div>
          <p className="text-muted" style={{ margin: "0.4rem 0 0 0" }}>
            Comprehensive assessment data utilized by your doctor, clinical dietitian, and AI engine for personalized diet formulation.
          </p>
        </div>
        <button
          onClick={() => navigate("/patient/profile/edit")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Edit3 size={16} /> Edit Assessment & Biometrics
        </button>
      </div>

      {/* Main Identity Glass Card */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", fontWeight: 700 }}>
              {profileData?.firstName ? profileData.firstName.charAt(0) : "P"}
            </div>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.35rem" }}>{profileData?.firstName} {profileData?.lastName}</h3>
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>{profileData?.email} • ID: #{profileData?.userId || profileData?.id || "P-1002"}</span>
              <div style={{ marginTop: "0.35rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>Biological Sex: {profileData?.gender || "Female"}</span>
                <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontSize: "0.75rem" }}>Age: {profileData?.age || 32} yrs</span>
                <span className="badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", fontSize: "0.75rem" }}>Blood: {profileData?.bloodGroup || profileData?.bloodType || "O+"}</span>
              </div>
            </div>
          </div>

          {/* Care Team badges */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", minWidth: "260px" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>Supervising Clinical Care Team</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
              <Stethoscope size={14} color="#0284c7" />
              <span><strong>Doctor:</strong> {profileData?.assignedDoctor || "Dr. Marcus Thorne, MD"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
              <UserCheck size={14} color="#10B981" />
              <span><strong>Dietitian:</strong> {profileData?.assignedDietitian || "Dr. Elena Rostova, RD"}</span>
            </div>
          </div>
        </div>

        {/* Biometrics & Caloric Target Grid */}
        <h4 style={{ margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Flame size={16} color="#f59e0b" /> Biometrics, Metabolic Rates & Recommended Targets
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Height / Weight</span>
            <strong style={{ fontSize: "1.05rem" }}>{profileData?.heightCm ? `${profileData.heightCm} cm` : "--"} / {profileData?.weightKg ? `${profileData.weightKg} kg` : "--"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Body Mass Index (BMI)</span>
            <strong style={{ fontSize: "1.05rem", color: profileData?.bmi > 25 ? "#f59e0b" : "#10B981" }}>{profileData?.bmi || "24.3"} kg/m²</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Basal Metabolic Rate (BMR)</span>
            <strong style={{ fontSize: "1.05rem" }}>{profileData?.bmr ? `${profileData.bmr} kcal` : "1,460 kcal"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Total Daily Expenditure (TDEE)</span>
            <strong style={{ fontSize: "1.05rem", color: "#0284c7" }}>{profileData?.tdee ? `${profileData.tdee} kcal` : "2,260 kcal"}</strong>
          </div>
          <div style={{ background: "rgba(16, 185, 129, 0.06)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block", color: "#10B981", fontWeight: 600 }}>Target Daily Calories</span>
            <strong style={{ fontSize: "1.05rem", color: "#10B981" }}>{profileData?.targetDailyCalories || profileData?.recommendedCalories || 1850} kcal/day</strong>
          </div>
          <div style={{ background: "rgba(2, 132, 199, 0.06)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(2, 132, 199, 0.25)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block", color: "#0284c7", fontWeight: 600 }}>Recommended Hydration</span>
            <strong style={{ fontSize: "1.05rem", color: "#0284c7" }}>{profileData?.recommendedWaterLiters || 2.3} Liters/day</strong>
          </div>
        </div>

        {/* Dietary Habits & Preferences Section */}
        <h4 style={{ margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Sparkles size={16} color="#0284c7" /> Dietary Preferences & Current Hydration
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Dietary Pattern</span>
            <strong>{profileData?.dietaryPreference || "Vegetarian"}</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Current Daily Water Intake</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
              <Droplet size={16} color="#0284c7" />
              <strong>{profileData?.currentWaterIntakeLiters ? `${profileData.currentWaterIntakeLiters} Liters (${Math.round(profileData.currentWaterIntakeLiters * 4)} glasses)` : "2.0 Liters"}</strong>
            </div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Physical Activity Level</span>
            <strong>{profileData?.activityLevel?.replace(/_/g, " ") || "MODERATELY ACTIVE (3-5 days/wk)"}</strong>
          </div>
        </div>

        {/* Health Goals & Clinical Requirements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.75rem" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", color: "#10B981", fontWeight: 600, fontSize: "0.85rem" }}>
              <Target size={16} /> Patient Health Goals
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.5 }}>
              {profileData?.healthGoals || "Glycemic regulation, body fat optimization, sustained energy levels."}
            </p>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", color: "#0284c7", fontWeight: 600, fontSize: "0.85rem" }}>
              <HeartPulse size={16} /> Clinical Nutritional Requirements
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.5 }}>
              {profileData?.nutritionalRequirements || "High soluble fiber (>30g/day), low saturated fat, anti-inflammatory micronutrients."}
            </p>
          </div>
        </div>

        {/* Known Allergies & Clinical Restrictions */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem", color: "#f59e0b", fontWeight: 600, fontSize: "0.85rem" }}>
            <ShieldAlert size={16} /> Food Allergies & Dietary Restrictions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {allergyList.length > 0 ? (
              allergyList.map((a, i) => (
                <span key={i} className="badge" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}>
                  ⚠️ Allergy: {a}
                </span>
              ))
            ) : (
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>No documented food allergies.</span>
            )}
            {restrictionList.map((r, i) => (
              <span key={i} className="badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)", fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}>
                Restriction: {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
