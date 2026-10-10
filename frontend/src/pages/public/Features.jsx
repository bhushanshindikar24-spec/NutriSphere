
import { Link } from "react-router-dom";
import { Activity, Brain, HeartPulse, Utensils, ShieldCheck, Check } from "lucide-react";

export default function Features() {
  const featureList = [
    {
      icon: <Activity size={28} color="var(--primary)" />,
      title: "Reality Score Engine",
      subtitle: "Multi-factor real-world adherence scoring",
      points: [
        "Food Availability: local grocery accessibility and seasonality checks",
        "Affordability: socioeconomic budget alignment and cost per meal",
        "Cooking Complexity: culinary skills, prep time, and equipment limits",
        "Taste Preferences: cultural and sensory flavor profile suitability",
        "Schedule Constraints: time-poor routines and travel feasibility",
      ],
    },
    {
      icon: <Brain size={28} color="var(--secondary)" />,
      title: "Adaptive Diet Engine",
      subtitle: "Intelligent clinical adaptation on deviations",
      points: [
        "Real-time substitute food recommendations matching macronutrient ratio",
        "Caloric redistribution following unplanned skips or indulgences",
        "Zero-compromise clinical restriction guardrails (allergies, diabetes, renal)",
        "Dietitian notification and review pipeline for significant shifts",
      ],
    },
    {
      icon: <HeartPulse size={28} color="#F59E0B" />,
      title: "Nutrition Digital Twin",
      subtitle: "Metabolic trajectory and biometric predictive modeling",
      points: [
        "Caloric deficit / surplus tracking mapped to 3,500 kcal/lb energetic baseline",
        "Estimated weight progression curves over 30, 60, and 90 day horizons",
        "Hydration status correlation with energy and satiety biomarkers",
        "Historical adherence regression analysis",
      ],
    },
    {
      icon: <Utensils size={28} color="#EC4899" />,
      title: "Home Food Mode",
      subtitle: "Pantry-first recipe and meal generation",
      points: [
        "Pantry inventory management with quantity and expiration tracking",
        "Algorithm-driven recipe generation using only available home items",
        "Automatic compliance comparison against active Dietitian Diet Plan",
        "Reduction of food waste and grocery friction",
      ],
    },
    {
      icon: <ShieldCheck size={28} color="#0EA5E9" />,
      title: "Adherence Barrier Detection",
      subtitle: "Proactive clinical barrier diagnosis and intervention",
      points: [
        "Automatic deviation flag when logged calories differ by >20%",
        "Structured barrier prompt (taste, cost, time, restaurant, illness)",
        "Barrier frequency trend analysis per patient",
        "Doctor and Dietitian shared clinical dashboard for barrier resolution",
      ],
    },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Platform Features & Scientific Engines</h1>
        <p className="text-muted" style={{ fontSize: "1.125rem", maxWidth: "700px", margin: "0 auto" }}>
          NutriSphere replaces rigid calorie calculators with dynamic clinical decision support 
          and human-centered adherence engineering.
        </p>
      </div>

      <div style={{ display: "grid", gap: "2.5rem" }}>
        {featureList.map((f, i) => (
          <div key={i} className="glass-panel" style={{ padding: "2.5rem", display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ background: "var(--bg-color)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
              {f.icon}
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{f.title}</h2>
              <p style={{ color: "var(--primary)", fontWeight: 500, fontSize: "0.875rem", marginBottom: "1rem" }}>{f.subtitle}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {f.points.map((pt, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
                    <Check size={18} color="var(--secondary)" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <Link to="/register" className="btn btn-primary" style={{ padding: "0.875rem 2.5rem", textDecoration: "none", fontSize: "1rem" }}>
          Start Using NutriSphere Today
        </Link>
      </div>
    </div>
  );
}
