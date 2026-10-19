import { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Stethoscope, Search, Info } from "lucide-react";
import api from "../../services/api";

const DEFAULT_CONDITIONS = [
  {
    id: 1,
    name: "PCOS / PCOD",
    category: "Endocrine & Metabolic",
    icdCode: "E28.2",
    description: "Polycystic Ovary Syndrome characterized by insulin resistance and hormonal imbalance.",
    dietaryRestrictions: "Low Glycemic Index, Anti-inflammatory, High Fiber (>30g/day), Moderate Low Carb",
    foodsToAvoid: "Refined flours, sugary bakery items, high-fructose syrups, trans-fats, processed deli meats, full-fat dairy with added hormones",
    recommendedFoods: "Spearmint tea, cinnamon, flaxseeds, chia seeds, leafy greens (spinach, kale), wild salmon, walnuts, avocados, berries",
    recommendedAlternatives: "Quinoa instead of white rice; Almond milk instead of regular cow milk; Stevia/Cinnamon instead of table sugar",
    clinicalGuidelines: "Review carbohydrate portions with dietitian; pair carbohydrates with healthy fats and protein to blunt insulin spikes.",
  },
  {
    id: 2,
    name: "Type 2 Diabetes Mellitus",
    category: "Endocrine & Metabolic",
    icdCode: "E11.9",
    description: "Chronic metabolic condition characterized by hyperglycemia, impaired insulin secretion and peripheral resistance.",
    dietaryRestrictions: "Strict Low Glycemic Load, High Soluble Fiber, Low Saturated Fat (<7% total kcal)",
    foodsToAvoid: "Simple table sugars, fruit juices, sodas, sweets, white bread, instant noodles, deep fried foods",
    recommendedFoods: "Steel-cut oats, barley, fenugreek seeds (methi), bitter gourd (karela), lentils, beans, non-starchy vegetables, tofu",
    recommendedAlternatives: "Cauliflower rice instead of polished rice; Zucchini noodles instead of semolina pasta; Chia seed pudding instead of sweetened custard",
    clinicalGuidelines: "Maintain consistent meal timing. Postprandial glucose tracking required. AI recommendations must be vetted by physician.",
  },
  {
    id: 3,
    name: "Hypertension",
    category: "Cardiovascular",
    icdCode: "I10",
    description: "Persistent elevated systemic arterial blood pressure requiring sodium limitation and arterial endothelial support.",
    dietaryRestrictions: "DASH Diet Pattern, Low Sodium (<1500 mg/day), High Potassium, Magnesium and Calcium",
    foodsToAvoid: "Pickles, papads, canned salted soups, processed cheeses, cured meats, MSG, salted potato chips, licorice",
    recommendedFoods: "Bananas, sweet potatoes, beets, unsalted almonds, pomegranates, garlic, spinach, low-fat yogurt",
    recommendedAlternatives: "Lemon juice and herbs (oregano, rosemary) instead of table salt; Baked sweet potato wedges instead of salted French fries",
    clinicalGuidelines: "Monitor systolic/diastolic trends daily. Maintain adequate hydration without excessive single-load fluid retention.",
  },
  {
    id: 4,
    name: "Hypothyroidism",
    category: "Endocrine",
    icdCode: "E03.9",
    description: "Underactive thyroid gland with reduced baseline metabolic rate and potential micronutrient deficiencies.",
    dietaryRestrictions: "Iodine and Selenium Support, Anti-inflammatory, Gluten-moderated, Limit excessive raw goitrogens",
    foodsToAvoid: "Excess raw cruciferous vegetables (raw cabbage, raw kale in large quantities), soy isoflavone isolates, heavily processed foods",
    recommendedFoods: "Brazil nuts (selenium), iodized sea salt (moderate), eggs, cooked broccoli, cooked spinach, pumpkin seeds, seaweed/nori",
    recommendedAlternatives: "Cooked cruciferous vegetables instead of raw smoothies; Coconut aminos instead of high-sodium soy sauce",
    clinicalGuidelines: "Allow 4 hours between thyroid medication (Levothyroxine) and high-calcium or high-iron food/supplements.",
  },
  {
    id: 5,
    name: "Hyperlipidemia / Dyslipidemia",
    category: "Cardiovascular",
    icdCode: "E78.5",
    description: "Elevated serum total cholesterol, LDL-C, and triglycerides with cardiovascular disease risk.",
    dietaryRestrictions: "Low Saturated Fat (<6% calories), Zero Trans Fats, High Viscous Soluble Fiber (>10g/day), Plant Sterols",
    foodsToAvoid: "Butter, palm oil, deep fried street foods, organ meats, full-fat cream, commercially baked pastries",
    recommendedFoods: "Oat bran, psyllium husk, walnuts, ground flaxseeds, olive oil, edamame, fatty fish (mackerel, salmon), apples",
    recommendedAlternatives: "Extra virgin olive oil instead of butter or ghee; Hummus instead of mayonnaise; Steamed fish instead of fried red meat",
    clinicalGuidelines: "Correlate daily saturated fat tracking with quarterly lipid profiles. Recommend lifestyle modifications alongside statins.",
  },
  {
    id: 6,
    name: "Celiac Disease / Gluten Sensitivity",
    category: "Gastrointestinal",
    icdCode: "K90.0",
    description: "Autoimmune enteropathy triggered by gluten consumption leading to small intestinal villous atrophy.",
    dietaryRestrictions: "100% Strict Gluten-Free diet (Zero wheat, barley, rye, triticale, or cross-contaminated oats)",
    foodsToAvoid: "Wheat bread, roti made from standard wheat atta, semolina (sooji), maida, beer, standard soy sauce, malt vinegar",
    recommendedFoods: "Certified gluten-free oats, quinoa, brown rice, millet (ragi, jowar, bajra), amaranth, all fresh vegetables, nuts",
    recommendedAlternatives: "Jowar/Bajra roti instead of wheat roti; Tamari instead of wheat-fermented soy sauce; Rice noodles instead of wheat noodles",
    clinicalGuidelines: "Ensure zero cross-contamination in kitchen utensils. Check micronutrient status (Ferritin, Vitamin D, Zinc).",
  },
];

export default function MedicalConditions() {
  const [conditions, setConditions] = useState([]);
  const [myConditions, setMyConditions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const [condRes, myCondRes] = await Promise.allSettled([
          api.get("/medical/conditions"),
          api.get("/medical/conditions/my"),
        ]);

        if (condRes.status === "fulfilled") {
          const list = condRes.value.data?.data || condRes.value.data || [];
          if (Array.isArray(list) && list.length > 0) {
            setConditions(list);
          } else {
            setConditions(DEFAULT_CONDITIONS);
          }
        } else {
          setConditions(DEFAULT_CONDITIONS);
        }

        if (myCondRes.status === "fulfilled") {
          const myList = myCondRes.value.data?.data || myCondRes.value.data || [];
          setMyConditions(Array.isArray(myList) ? myList : []);
        }
      } catch (_e) {
        setConditions(DEFAULT_CONDITIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchConditions();
  }, []);

  const filtered = conditions.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.dietaryRestrictions && c.dietaryRestrictions.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const myConditionNames = new Set(
    myConditions.map((mc) => mc.conditionName?.toLowerCase().trim())
  );

  if (loading) return <div className="loading-screen">Loading Medical Food Restriction Database...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "rgba(239, 68, 68, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#ef4444" }}>
            <ShieldAlert size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Medical Condition–Based Food Restriction Database</h2>
        </div>
        <p className="text-muted" style={{ margin: "0.4rem 0 0 0" }}>
          Clinical mapping of medical conditions to dietary restrictions, prohibited ingredients, and recommended healthy food alternatives. All diet plans are vetted by qualified medical practitioners.
        </p>
      </div>

      {/* Clinical Review Notice Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.06) 100%)",
          border: "1px solid rgba(2, 132, 199, 0.25)",
          padding: "1rem 1.25rem",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Stethoscope size={22} color="#0284c7" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
          <strong>Clinical Supervision Notice:</strong> NutriSphere maps your diagnosed conditions to personalized dietary protocols. Before activating restrictive diets, all AI recommendations must be formally reviewed and approved by your attending doctor or qualified dietitian.
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: "relative" }}>
        <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          type="text"
          className="input-field"
          placeholder="Search conditions (e.g., PCOS, Diabetes, Hypertension, Celiac, Cholesterol)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", paddingLeft: "2.75rem" }}
        />
      </div>

      {/* Condition Cards Grid */}
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {filtered.map((cond) => {
          const isPatientCondition = myConditionNames.has(cond.name.toLowerCase().trim());
          return (
            <div
              key={cond.id || cond.name}
              className="glass-panel"
              style={{
                padding: "1.75rem",
                borderRadius: "var(--radius-lg)",
                border: isPatientCondition ? "2px solid #0284c7" : "1px solid var(--border-color)",
                position: "relative",
              }}
            >
              {isPatientCondition && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#0284c7",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.3rem 0.8rem",
                    borderBottomLeftRadius: "8px",
                  }}
                >
                  Active in Your Medical History
                </div>
              )}

              {/* Title & ICD */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.35rem" }}>{cond.name}</h3>
                <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>{cond.category || "Clinical Specialty"}</span>
                {cond.icdCode && (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "rgba(255, 255, 255, 0.05)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    ICD-10: {cond.icdCode}
                  </span>
                )}
              </div>

              <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {cond.description}
              </p>

              {/* Dietary Restrictions Protocol */}
              {cond.dietaryRestrictions && (
                <div style={{ background: "rgba(2, 132, 199, 0.08)", border: "1px solid rgba(2, 132, 199, 0.2)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Info size={14} /> Recommended Dietary Protocol:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>{cond.dietaryRestrictions}</div>
                </div>
              )}

              {/* Grid: Foods to Avoid vs Recommended Foods */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                {/* Foods to Limit or Avoid */}
                <div style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "1.1rem", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ef4444", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    <AlertTriangle size={16} /> Foods to Strictly Limit or Avoid:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {cond.foodsToAvoid}
                  </div>
                </div>

                {/* Recommended Foods */}
                <div style={{ background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "1.1rem", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#10B981", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    <CheckCircle2 size={16} /> Recommended Nutrient-Dense Foods:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {cond.recommendedFoods}
                  </div>
                </div>
              </div>

              {/* Recommended Healthy Alternatives */}
              {cond.recommendedAlternatives && (
                <div style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.2)", padding: "0.85rem 1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Sparkles size={14} /> Recommended Healthy Culinary Alternatives:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.4 }}>
                    {cond.recommendedAlternatives}
                  </div>
                </div>
              )}

              {/* Clinical Guidelines */}
              {cond.clinicalGuidelines && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                  👨‍⚕️ <strong>Care Team Guideline:</strong> {cond.clinicalGuidelines}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
