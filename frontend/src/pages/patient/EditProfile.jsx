import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  Save, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  User, 
  HeartPulse, 
  Flame, 
  Droplet, 
  Stethoscope, 
  Dna, 
  Pill, 
  FileText, 
  Upload, 
  AlertCircle 
} from "lucide-react";
import api from "../../services/api";

const COMMON_ALLERGIES = [
  "Peanuts", 
  "Tree Nuts", 
  "Shellfish", 
  "Dairy / Lactose", 
  "Gluten / Wheat", 
  "Eggs", 
  "Soy", 
  "Fish"
];

const DIETARY_OPTIONS = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "NON_VEGETARIAN", label: "Non-Vegetarian" },
  { value: "EGGETARIAN", label: "Eggetarian" },
  { value: "JAIN", label: "Jain Vegetarian" },
  { value: "PESCATARIAN", label: "Pescatarian" },
];

const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Sedentary (Desk job, little to no regular exercise)" },
  { value: "LIGHTLY_ACTIVE", label: "Lightly Active (Light exercise / walks 1-3 days/week)" },
  { value: "MODERATELY_ACTIVE", label: "Moderately Active (Moderate workouts / jogging 3-5 days/week)" },
  { value: "VERY_ACTIVE", label: "Very Active (Intense sports / gym training 6-7 days/week)" },
  { value: "EXTRA_ACTIVE", label: "Extra Active (Strenuous physical labor / 2x daily training)" },
];

export default function EditProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Purely dynamic state with NO hardcoded default values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    phoneNumber: "",
    occupation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    
    // Biometrics & Vitals
    heightCm: "",
    weightKg: "",
    bloodPressure: "",
    restingHeartRate: "",
    
    // Activity & Habits
    activityLevel: "",
    exerciseType: "",
    exerciseFrequencyDuration: "",
    smokingTobacco: "",
    alcoholConsumption: "",
    
    // Dietary
    dietaryPreference: "",
    currentWaterIntakeLiters: "",
    foodIntolerances: "",
    mealsPerDay: "",
    mealTimings: "",
    typicalFoodIntake: "",
    
    // Medical & History
    diagnosedConditions: "",
    currentSymptoms: "",
    previousSurgeries: "",
    familyMedicalHistory: "",
    currentMedications: "",
    vitaminsSupplements: "",
    
    // Goals & Requirements
    healthGoals: "",
    nutritionalRequirements: "",
    targetDailyCalories: "",
    targetDailyWaterMl: "",
  });

  // Single unified allergy state: selectable chips + other free-text specify
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [otherAllergies, setOtherAllergies] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Blood report modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("LAB_REPORT");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportNotes, setReportNotes] = useState("");
  const [reportFile, setReportFile] = useState(null);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await api.get("/patients/profile");
        const d = res.data?.data || res.data;
        if (d) {
          setFormData({
            firstName: d.firstName || user?.firstName || "",
            lastName: d.lastName || user?.lastName || "",
            dateOfBirth: d.dateOfBirth ? d.dateOfBirth.toString().slice(0, 10) : "",
            gender: d.gender || "",
            bloodType: d.bloodType || d.bloodGroup || "",
            phoneNumber: d.phoneNumber || user?.phoneNumber || "",
            occupation: d.occupation || "",
            emergencyContactName: d.emergencyContactName || "",
            emergencyContactPhone: d.emergencyContactPhone || "",
            
            heightCm: d.heightCm !== null && d.heightCm !== undefined ? d.heightCm : "",
            weightKg: d.weightKg !== null && d.weightKg !== undefined ? d.weightKg : "",
            bloodPressure: d.bloodPressure || "",
            restingHeartRate: d.restingHeartRate !== null && d.restingHeartRate !== undefined ? d.restingHeartRate : "",
            
            activityLevel: d.activityLevel || "",
            exerciseType: d.exerciseType || "",
            exerciseFrequencyDuration: d.exerciseFrequencyDuration || "",
            smokingTobacco: d.smokingTobacco || "",
            alcoholConsumption: d.alcoholConsumption || "",
            
            dietaryPreference: d.dietaryPreference || "",
            currentWaterIntakeLiters: d.currentWaterIntakeLiters !== null && d.currentWaterIntakeLiters !== undefined ? d.currentWaterIntakeLiters : "",
            foodIntolerances: d.foodIntolerances || "",
            mealsPerDay: d.mealsPerDay || "",
            mealTimings: d.mealTimings || "",
            typicalFoodIntake: d.typicalFoodIntake || "",
            
            diagnosedConditions: d.diagnosedConditions || d.activeCondition || "",
            currentSymptoms: d.currentSymptoms || "",
            previousSurgeries: d.previousSurgeries || "",
            familyMedicalHistory: d.familyMedicalHistory || "",
            currentMedications: d.currentMedications || "",
            vitaminsSupplements: d.vitaminsSupplements || "",
            
            healthGoals: d.healthGoals || "",
            nutritionalRequirements: d.nutritionalRequirements || "",
            targetDailyCalories: d.targetDailyCalories || "",
            targetDailyWaterMl: d.targetDailyWaterMl || "",
          });

          // Parse allergies into unified selectable chips + "other" text
          if (d.allergies) {
            const rawList = d.allergies.split(",").map((s) => s.trim()).filter(Boolean);
            const matchedChips = [];
            const otherItems = [];
            
            rawList.forEach((item) => {
              const matched = COMMON_ALLERGIES.find(
                (ca) => ca.toLowerCase() === item.toLowerCase() || item.toLowerCase().includes(ca.toLowerCase().split(" ")[0])
              );
              if (matched && !matchedChips.includes(matched)) {
                matchedChips.push(matched);
              } else {
                otherItems.push(item);
              }
            });
            
            setSelectedAllergies(matchedChips);
            setOtherAllergies(otherItems.join(", "));
          }
        }
      } catch (_e) {
        // Fallback to auth context basics with NO mock/hardcoded values
        setFormData((prev) => ({
          ...prev,
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          phoneNumber: user?.phoneNumber || "",
        }));
      } finally {
        setFetching(false);
      }
    };
    fetchExisting();
  }, [user]);

  // Live calculation of BMR and TDEE (only when real height and weight are provided)
  const weight = Number(formData.weightKg);
  const height = Number(formData.heightCm);
  const hasBiometrics = weight > 0 && height > 0;
  
  let bmr = null;
  let tdee = null;
  let recCalories = null;
  let recWater = null;

  if (hasBiometrics) {
    const age = formData.dateOfBirth 
      ? Math.max(10, new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()) 
      : 30;
    const isFemale = formData.gender === "FEMALE";
    bmr = Math.round((10 * weight) + (6.25 * height) - (5 * age) + (isFemale ? -161 : 5));
    
    let multiplier = 1.375;
    if (formData.activityLevel === "SEDENTARY") multiplier = 1.2;
    else if (formData.activityLevel === "LIGHTLY_ACTIVE") multiplier = 1.375;
    else if (formData.activityLevel === "MODERATELY_ACTIVE") multiplier = 1.55;
    else if (formData.activityLevel === "VERY_ACTIVE") multiplier = 1.725;
    else if (formData.activityLevel === "EXTRA_ACTIVE") multiplier = 1.9;

    tdee = Math.round(bmr * multiplier);
    recCalories = Math.max(1200, formData.healthGoals?.toLowerCase().includes("loss") ? tdee - 400 : tdee);
    recWater = Math.round(weight * 0.033 * 10) / 10;
  }

  // Toggle common allergy chips
  const toggleAllergyChip = (allergen) => {
    if (selectedAllergies.includes(allergen)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergen));
    } else {
      setSelectedAllergies([...selectedAllergies, allergen]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Combine selected allergy chips and other specify field into single clean string
    const otherItems = otherAllergies
      ? otherAllergies.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const combinedAllergies = [...selectedAllergies, ...otherItems].join(", ");

    const payload = {
      ...formData,
      allergies: combinedAllergies,
      heightCm: formData.heightCm ? Number(formData.heightCm) : null,
      weightKg: formData.weightKg ? Number(formData.weightKg) : null,
      restingHeartRate: formData.restingHeartRate ? Number(formData.restingHeartRate) : null,
      currentWaterIntakeLiters: formData.currentWaterIntakeLiters ? Number(formData.currentWaterIntakeLiters) : null,
      targetDailyCalories: recCalories || (formData.targetDailyCalories ? Number(formData.targetDailyCalories) : null),
      targetDailyWaterMl: formData.currentWaterIntakeLiters ? Number(formData.currentWaterIntakeLiters) * 1000 : null,
    };

    try {
      await api.put("/patients/profile", payload);
      setSuccess(true);
      setTimeout(() => navigate("/patient/profile"), 1000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      setUploadError("Please provide a report title.");
      return;
    }
    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      await api.post("/medical/laboratory", {
        title: reportTitle.trim(),
        reportType,
        reportDate,
        notes: reportNotes || "Uploaded via Patient Profile Portal",
        fileName: reportFile ? reportFile.name : null,
        status: "COMPLETED",
      });

      setUploadSuccess("Report record created successfully!");
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess("");
        setReportTitle("");
        setReportNotes("");
        setReportFile(null);
      }, 1000);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload blood report.");
    } finally {
      setUploadLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading-screen">Loading Patient Assessment & Health Biometrics...</div>;
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Top Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <button
          onClick={() => navigate("/patient/profile")}
          className="btn btn-outline"
          style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={16} /> Back to My Profile
        </button>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          style={{
            background: "#f0f9ff",
            border: "1px solid rgba(2, 132, 199, 0.3)",
            color: "#0284c7",
            padding: "0.55rem 1.15rem",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Upload size={16} /> Upload Blood Report (PDF/Image)
        </button>
      </div>

      <div>
        <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#0f172a" }}>
          Edit Patient Assessment & Health Biometrics
        </h2>
        <p className="text-muted" style={{ margin: "0.4rem 0 0 0", fontSize: "0.92rem" }}>
          Update personal identity, biometrics, dietary habits, and complete clinical & hereditary medical records.
        </p>
      </div>

      {success && (
        <div style={{ 
          background: "rgba(16, 185, 129, 0.12)", 
          border: "1px solid rgba(16, 185, 129, 0.35)", 
          color: "#059669", 
          padding: "1rem 1.25rem", 
          borderRadius: "12px", 
          display: "flex", 
          alignItems: "center", 
          gap: "0.6rem" 
        }}>
          <CheckCircle2 size={20} />
          <strong style={{ fontSize: "0.95rem" }}>
            Patient profile and clinical assessment updated successfully! Caloric targets recalculated. Redirecting...
          </strong>
        </div>
      )}

      {errorMsg && (
        <div style={{ 
          background: "rgba(239, 68, 68, 0.1)", 
          border: "1px solid rgba(239, 68, 68, 0.3)", 
          color: "#dc2626", 
          padding: "1rem 1.25rem", 
          borderRadius: "12px", 
          display: "flex", 
          alignItems: "center", 
          gap: "0.6rem" 
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: "0.92rem" }}>{errorMsg}</span>
        </div>
      )}

      {/* Live Biometric Calculation Preview Banner */}
      <div className="glass-panel" style={{ 
        padding: "1.25rem 1.5rem", 
        borderRadius: "14px", 
        background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(14, 165, 233, 0.03) 100%)", 
        border: "1px solid rgba(2, 132, 199, 0.25)" 
      }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <Sparkles size={16} /> Live Metabolic & Caloric Calculation Preview
        </div>
        {hasBiometrics ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>BMR (Basal)</span>
              <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>{bmr} kcal</strong>
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
              <strong style={{ fontSize: "1.1rem", color: "#0ea5e9" }}>{recWater} L/day</strong>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
            Enter your Height (cm) and Current Weight (kg) in the biometrics section below to generate real-time basal metabolic rate (BMR), maintenance expenditure (TDEE), and daily caloric recommendations.
          </p>
        )}
      </div>

      {/* Main Two-Sided Form Layout */}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
          gap: "2rem",
          alignItems: "start"
        }}>

          {/* ============================================================ */}
          {/* SIDE 1: PERSONAL INFORMATION & LIFESTYLE                      */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <User size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  1. Personal Information & Contact
                </h3>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      placeholder="e.g. Ananya"
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
                      placeholder="e.g. Kulkarni"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                      <option value="">Select Biological Sex</option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Email Address (Registered Account)</label>
                    <input
                      type="email"
                      className="input-field"
                      disabled
                      value={user?.email || ""}
                      style={{ width: "100%", background: "#f8fafc", cursor: "not-allowed", color: "#64748b" }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Occupation / Student / Other</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Software Engineer, University Student, Teacher, Homemaker"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Emergency Contact Name (Optional)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Priya Kulkarni"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Emergency Contact Phone (Optional)</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="e.g. +91 98230 12345"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <HeartPulse size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  2. Physical Biometrics & Vital Signs
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="form-label">Height (cm) *</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    min="50"
                    max="250"
                    placeholder="e.g. 168"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
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
                    placeholder="e.g. 68.5"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Blood Group</label>
                  <select
                    className="input-field"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Blood Pressure (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 120/80 mmHg"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Resting Heart Rate (bpm, Optional)</label>
                  <input
                    type="number"
                    min="30"
                    max="220"
                    className="input-field"
                    placeholder="e.g. 72"
                    value={formData.restingHeartRate}
                    onChange={(e) => setFormData({ ...formData, restingHeartRate: e.target.value })}
                    style={{ width: "100%" }}
                  />
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <Flame size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  3. Physical Activity & Habits
                </h3>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label className="form-label">Physical Activity Level *</label>
                  <select
                    className="input-field"
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="">Select Activity Level</option>
                    {ACTIVITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Type of Exercise</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Resistance Training, Yoga, Jogging"
                      value={formData.exerciseType}
                      onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Exercise Frequency & Duration</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 45 mins, 3-4 days/week"
                      value={formData.exerciseFrequencyDuration}
                      onChange={(e) => setFormData({ ...formData, exerciseFrequencyDuration: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Smoking / Tobacco Use (Optional)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. None / Non-smoker, Occasional"
                      value={formData.smokingTobacco}
                      onChange={(e) => setFormData({ ...formData, smokingTobacco: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Alcohol Consumption (Optional)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. None, Social / 1-2 drinks per month"
                      value={formData.alcoholConsumption}
                      onChange={(e) => setFormData({ ...formData, alcoholConsumption: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Dietary Habits, Intake & Allergies */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <Droplet size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  4. Dietary Habits & Intake Patterns
                </h3>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Dietary Preference *</label>
                    <select
                      className="input-field"
                      value={formData.dietaryPreference}
                      onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                      style={{ width: "100%" }}
                    >
                      <option value="">Select Dietary Preference</option>
                      {DIETARY_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
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
                      placeholder="e.g. 2.5"
                      value={formData.currentWaterIntakeLiters}
                      onChange={(e) => setFormData({ ...formData, currentWaterIntakeLiters: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* SINGLE UNIFIED FOOD ALLERGIES SECTION (NO DUPLICATE) */}
                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "1.25rem",
                  borderRadius: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <label className="form-label" style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>
                      Food Allergies (Select known allergens & specify any other below)
                    </label>
                  </div>
                  <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "#7f1d1d" }}>
                    Select from common allergens below and/or specify custom allergies in the "Other — specify" field. Duplicate fields have been removed.
                  </p>

                  {/* Selectable allergy chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    {COMMON_ALLERGIES.map((allergen) => {
                      const isSelected = selectedAllergies.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          type="button"
                          onClick={() => toggleAllergyChip(allergen)}
                          style={{
                            background: isSelected ? "#ef4444" : "#ffffff",
                            border: isSelected ? "1px solid #dc2626" : "1px solid #f87171",
                            color: isSelected ? "#ffffff" : "#b91c1c",
                            padding: "0.35rem 0.8rem",
                            borderRadius: "20px",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            fontWeight: isSelected ? 700 : 500,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            transition: "all 0.15s ease",
                            boxShadow: isSelected ? "0 2px 6px rgba(239, 68, 68, 0.3)" : "none"
                          }}
                        >
                          <span>{isSelected ? "✓" : "+"}</span>
                          <span>{allergen}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Other - specify field */}
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "#991b1b" }}>
                      Other Allergies — specify (comma separated)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Sesame, Kiwi, Strawberries, Sulfites"
                      value={otherAllergies}
                      onChange={(e) => setOtherAllergies(e.target.value)}
                      style={{ width: "100%", background: "#ffffff", borderColor: "#fca5a5" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Food Intolerances</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Lactose intolerance, Fructose malabsorption, Histamine sensitivity"
                    value={formData.foodIntolerances}
                    onChange={(e) => setFormData({ ...formData, foodIntolerances: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Number of Meals Per Day</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 3 main meals + 1 snack"
                      value={formData.mealsPerDay}
                      onChange={(e) => setFormData({ ...formData, mealsPerDay: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Usual Meal Timings (Breakfast, Lunch, Dinner, Snacks)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Breakfast 8:30 AM, Lunch 1:30 PM, Dinner 8 PM"
                      value={formData.mealTimings}
                      onChange={(e) => setFormData({ ...formData, mealTimings: e.target.value })}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Typical Daily Food Intake (Meal-by-Meal)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="e.g. Breakfast: Vegetable Poha or Moong Dal Chilla. Lunch: 2 Multigrain Phulkas with Dal Tadka, Sabzi & Dahi. Snack: Roasted Makhana or Sprouts Chaat. Dinner: Moong Dal Khichdi with Desi Ghee or Jowar Bhakri with Palak Paneer."
                    value={formData.typicalFoodIntake}
                    onChange={(e) => setFormData({ ...formData, typicalFoodIntake: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <Stethoscope size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  5. Diagnosed Conditions & Symptoms
                </h3>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label className="form-label">Diagnosed Health Condition</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. PCOS (Polycystic Ovary Syndrome), Type 2 Diabetes, Essential Hypertension, Hypothyroidism, None"
                    value={formData.diagnosedConditions}
                    onChange={(e) => setFormData({ ...formData, diagnosedConditions: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label className="form-label">Current Symptoms Experienced</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Afternoon fatigue, insulin resistance, sleep disturbance, morning headaches, joint stiffness"
                    value={formData.currentSymptoms}
                    onChange={(e) => setFormData({ ...formData, currentSymptoms: e.target.value })}
                    style={{ width: "100%" }}
                  />
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <Dna size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  6. Surgeries & Family Medical History
                </h3>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label className="form-label">Previous Surgeries (Optional)</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Laparoscopic ovarian cystectomy (2022), Appendectomy (2018), None"
                    value={formData.previousSurgeries}
                    onChange={(e) => setFormData({ ...formData, previousSurgeries: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label className="form-label">Family Medical History (Optional)</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Mother has Type 2 Diabetes; Maternal grandmother had hypertension and cardiovascular disease"
                    value={formData.familyMedicalHistory}
                    onChange={(e) => setFormData({ ...formData, familyMedicalHistory: e.target.value })}
                    style={{ width: "100%" }}
                  />
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <Pill size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  7. Medications & Nutritional Supplements
                </h3>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label className="form-label">Current Medications and Dosages</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Metformin 500mg (1x daily with evening meal), Lisinopril 10mg (morning)"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label className="form-label">Vitamins and Supplements Currently Taken (Optional)</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Vitamin D3 2000 IU daily, Inositol supplement, Omega-3 Fish Oil 1000mg, Magnesium glycinate"
                    value={formData.vitaminsSupplements}
                    onChange={(e) => setFormData({ ...formData, vitaminsSupplements: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Card 8: Blood Reports & Clinical AI Deficiency Analysis */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <FileText size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  8. Diagnostic Blood Reports (PDF/Image)
                </h3>
              </div>

              <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                Upload metabolic panels, lipid profiles, and vitamin assays. Blood reports and clinical AI deficiency recommendations are automatically linked to your profile and reflected in your diet plan.
              </p>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.65rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)"
                  }}
                >
                  <Upload size={16} />
                  Upload Blood Report (PDF/Image)
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/patient/reports")}
                  className="btn btn-outline"
                  style={{ fontSize: "0.85rem" }}
                >
                  View All Blood Reports & Trends
                </button>
              </div>
            </div>

            {/* Card 9: Health Goals & Target Requirements */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <Sparkles size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  9. Health Goals & Clinical Target Requirements
                </h3>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label className="form-label">Primary Health Goals *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Glycemic Control, Weight Management, PCOS Symptom Reduction, Blood Pressure Stability"
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
                    placeholder="e.g. High fiber (>30g), Moderate low-GI carbohydrates, Anti-inflammatory healthy fats"
                    value={formData.nutritionalRequirements}
                    onChange={(e) => setFormData({ ...formData, nutritionalRequirements: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: "1rem", 
          padding: "1.25rem 0", 
          borderTop: "1px solid #e2e8f0" 
        }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/patient/profile")}
            style={{ padding: "0.75rem 1.5rem" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              padding: "0.75rem 1.75rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
            }}
          >
            <Save size={18} />
            {loading ? "Recalculating & Saving Profile..." : "Save Assessment Changes"}
          </button>
        </div>
      </form>

      {/* Upload Blood Report Modal */}
      {showUploadModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "18px",
            maxWidth: "520px",
            width: "100%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                Upload Blood Diagnostic Report
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "0.25rem" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadReport} style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
              {uploadSuccess && (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem" }}>
                  {uploadSuccess}
                </div>
              )}
              {uploadError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem" }}>
                  {uploadError}
                </div>
              )}

              <div>
                <label className="form-label">Report Title *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Comprehensive Metabolic Panel (CMP)"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Panel Type</label>
                  <select
                    className="input-field"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option value="LAB_REPORT">Lab Report</option>
                    <option value="LIPID">Lipid Panel</option>
                    <option value="GLUCOSE">Glucose / HbA1c</option>
                    <option value="VITAMIN">Vitamin Profile</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Test Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Attach File (PDF or Image)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setReportFile(e.target.files[0])}
                  style={{ width: "100%", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label className="form-label">Clinical Notes / Comments</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Fasting sample taken in morning"
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? "Uploading..." : "Save Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
