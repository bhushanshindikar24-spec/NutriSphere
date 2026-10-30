import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, CheckCircle2, ArrowLeft, Send, Sparkles, AlertCircle } from "lucide-react";

export default function CustomMealRequest() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    mealType: "LUNCH",
    healthCondition: "Diabetes Type 2 & Mild Hypertension",
    targetCalories: "450",
    grainPreference: "Jowar Bhakri (Gluten-Free)",
    dalOrProtein: "Yellow Moong Dal Tadka + Low-Fat Paneer",
    spiceLevel: "MILD",
    saltType: "SENDHA_NAMAK",
    specialInstructions: "Please use sendha namak (rock salt) with minimal oil and include fresh cucumber kachumber."
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // scroll to confirmation
    }, 100);
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <button
          onClick={() => navigate("/patient/hotel/menu")}
          className="btn btn-outline"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={16} /> Back to Hotel Menu
        </button>
        <span style={{
          background: "#fffbeb",
          color: "#78350f",
          border: "1px solid #fde68a",
          padding: "0.35rem 0.85rem",
          borderRadius: "9999px",
          fontWeight: 700,
          fontSize: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem"
        }}>
          <Sparkles size={15} /> Chef Special Rx Order
        </span>
      </div>

      <div>
        <h2 style={{ margin: "0 0 0.5rem 0" }}>Custom Therapeutic Meal Request</h2>
        <p className="text-muted" style={{ margin: 0 }}>
          Directly instruct our executive chef and clinical dietitian team to prepare a personalized meal matching your exact caloric, glycemic, and sodium limits.
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel" style={{
          padding: "3rem",
          textAlign: "center",
          borderRadius: "20px",
          border: "2px solid #10b981",
          background: "linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#ecfdf5",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem"
          }}>
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#065f46" }}>Request Transmitted to Central Kitchen</h3>
          <p style={{ maxWidth: "550px", margin: "0 auto 1.5rem", color: "#4b5563", lineHeight: 1.6, fontSize: "0.92rem" }}>
            Our clinical dietitian has received your custom meal requirements. The kitchen in BKC, Mumbai is reviewing your macro balance and will dispatch within 35-45 minutes.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button onClick={() => navigate("/patient/hotel/orders")} className="btn btn-primary">
              Track in Orders
            </button>
            <button onClick={() => setSubmitted(false)} className="btn btn-outline">
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "2rem", borderRadius: "18px", display: "grid", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Meal Slot</label>
              <select
                className="input-field"
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="BREAKFAST">Subah ka Nashta (Breakfast - 08:30 AM IST)</option>
                <option value="LUNCH">Dopahar ka Bhojan (Lunch - 01:30 PM IST)</option>
                <option value="SNACK">Shaam ka Nashta (Evening Snack - 05:00 PM IST)</option>
                <option value="DINNER">Raat ka Khana (Dinner - 08:00 PM IST)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Calorie Budget Target (kcal)</label>
              <input
                type="number"
                className="input-field"
                value={formData.targetCalories}
                onChange={(e) => setFormData({ ...formData, targetCalories: e.target.value })}
                placeholder="e.g. 450"
                style={{ width: "100%" }}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Primary Grain / Roti Preference</label>
              <select
                className="input-field"
                value={formData.grainPreference}
                onChange={(e) => setFormData({ ...formData, grainPreference: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="Jowar Bhakri (Gluten-Free)">Jowar Bhakri (Gluten-Free & Low GI)</option>
                <option value="Bajra Roti (Iron Rich)">Bajra Roti (Iron & Magnesium Rich)</option>
                <option value="Multigrain Phulka (Wheat + Chana + Oats)">Multigrain Phulka (Wheat + Chana + Oats)</option>
                <option value="Steamed Brown Basmati Rice">Steamed Brown Basmati Rice</option>
                <option value="No Grains (High Protein Bowl)">No Grains (High Protein Bowl Only)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Protein / Dal Base</label>
              <select
                className="input-field"
                value={formData.dalOrProtein}
                onChange={(e) => setFormData({ ...formData, dalOrProtein: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="Yellow Moong Dal Tadka + Low-Fat Paneer">Yellow Moong Dal Tadka + Low-Fat Paneer</option>
                <option value="Panchmel Dal + Roasted Chana">Panchmel Dal + Roasted Chana</option>
                <option value="Tandoori Chicken Tikka (Skinless Breast)">Tandoori Chicken Tikka (Skinless Breast)</option>
                <option value="Desi Egg Bhurji (2 Whites + 1 Whole)">Desi Egg Bhurji (2 Whites + 1 Whole)</option>
                <option value="Sprouted Kala Chana & Lauki Curry">Sprouted Kala Chana & Lauki Curry</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Spice Calibration</label>
              <select
                className="input-field"
                value={formData.spiceLevel}
                onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="VERY_MILD">Very Mild (Zero chili, jeera & turmeric only)</option>
                <option value="MILD">Mild (Subtle cumin, ginger & coriander)</option>
                <option value="MEDIUM">Medium Authentic Indian Spice</option>
              </select>
            </div>

            <div>
              <label className="form-label">Salt / Sodium Specification</label>
              <select
                className="input-field"
                value={formData.saltType}
                onChange={(e) => setFormData({ ...formData, saltType: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="SENDHA_NAMAK">Sendha Namak (Himalayan Pink Salt - Cardiac/Hypertension)</option>
                <option value="LOW_SODIUM">Ultra-Low Sodium (&lt; 1g for Renal Patients)</option>
                <option value="STANDARD">Standard Iodized Salt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Chef Notes & Health Constraints</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              placeholder="e.g., Avoid onions, extra ghee tadka on khichdi, include mint dip..."
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>

          <div style={{
            background: "#eff6ff",
            padding: "1rem",
            borderRadius: "12px",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            fontSize: "0.85rem",
            color: "#1e40af"
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              All custom therapeutic meal requests are vetted by our registered dietitian before cooking commences to prevent adverse food-drug or condition interactions. Estimated price: <strong>₹180 - ₹250</strong>.
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => navigate("/patient/hotel/menu")}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                border: "none",
                boxShadow: "0 4px 14px rgba(217, 119, 6, 0.25)"
              }}
            >
              <Send size={16} /> Transmit Request to Kitchen
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
