import {  useState, useEffect  } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Award, Zap } from "lucide-react";
import api from "../../services/api";

export default function NutritionAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Built from the patient's real food logs for the last 7 days (and their requirement targets)
    const fetchAnalysis = async () => {
      const to = new Date();
      const from = new Date(Date.now() - 6 * 864e5);
      const iso = (d) => d.toISOString().slice(0, 10);
      try {
        const [logsRes, reqRes] = await Promise.allSettled([
          api.get(`/food-logs/range?from=${iso(from)}&to=${iso(to)}`),
          api.get("/nutrition/requirements/my"),
        ]);
        const logs = logsRes.status === "fulfilled" ? logsRes.value.data?.data || [] : [];
        const reqs = reqRes.status === "fulfilled" ? reqRes.value.data?.data : null;
        if (!logs.length) {
          setAnalysis(null);
          return;
        }
        const sum = (k) => logs.reduce((t, l) => t + (Number(l[k]) || 0), 0);
        const daysLogged = new Set(logs.map((l) => l.logDate)).size || 1;
        const protein = sum("proteinG"), carbs = sum("carbsG"), fat = sum("fatG"), fiber = sum("fiberG");
        const kcalFromMacros = protein * 4 + carbs * 4 + fat * 9;
        const pct = (v) => (kcalFromMacros > 0 ? Math.round((v / kcalFromMacros) * 100) : 0);
        const macroSplit = [
          { name: "Carbohydrates", value: pct(carbs * 4), color: "#10B981" },
          { name: "Protein", value: pct(protein * 4), color: "#3B82F6" },
          { name: "Fats", value: pct(fat * 9), color: "#F59E0B" },
        ];
        const fiberAvg = Math.round((fiber / daysLogged) * 10) / 10;
        const fiberTarget = reqs?.fiberGTarget ?? null;
        const insights = [
          `Based on ${logs.length} logged items across ${daysLogged} day(s) in the last week.`,
          `Energy split: ${macroSplit.map((m) => `${m.name.toLowerCase()} ${m.value}%`).join(", ")}.`,
          fiberTarget
            ? `Average fiber intake is ${fiberAvg} g/day, ${Math.round((fiberAvg / fiberTarget) * 100)}% of your ${fiberTarget} g target.`
            : `Average fiber intake is ${fiberAvg} g/day (no fiber target has been set by your dietitian yet).`,
        ];
        setAnalysis({ macroSplit, fiberG: fiberAvg, fiberTargetG: fiberTarget, daysLogged, insights });
      } catch (_err) {
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  if (loading) return <div className="loading-screen">Analyzing Nutritional Bio-Data...</div>;
  if (!analysis) return <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No food logs in the last 7 days. Log your meals to see your nutrition analysis.</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <h2>In-Depth Nutrition Analysis</h2>
        <p className="text-muted">Biochemical and macronutrient breakdown derived from your weekly nutritional logs.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Macro Distribution */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
          <h4 style={{ margin: "0 0 1rem 0" }}>Macronutrient Energy Distribution</h4>
          <div style={{ height: "240px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysis?.macroSplit || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analysis?.macroSplit || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem" }}>
            {(analysis?.macroSplit || []).map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                <span>{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Micronutrient Balance */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ margin: "0 0 1.25rem 0" }}>Fiber Intake (7-day average)</h4>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                  <span>Dietary Fiber</span>
                  <strong>
                    {analysis.fiberG} {analysis.fiberTargetG ? `/ ${analysis.fiberTargetG}` : ""} g/day
                  </strong>
                </div>
                {analysis.fiberTargetG > 0 && (
                  <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px" }}>
                    <div style={{ width: `${Math.min(100, (analysis.fiberG / analysis.fiberTargetG) * 100)}%`, height: "100%", background: "#10B981", borderRadius: "3px" }} />
                  </div>
                )}
              </div>
              <p className="text-muted" style={{ margin: 0, fontSize: "0.8rem" }}>
                Sodium and potassium are not tracked in food logs yet, so they are not shown here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Insights */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Zap size={20} color="var(--primary)" /> Algorithmic Clinical Insights
        </h4>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {(analysis?.insights || []).map((insight, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9rem" }}>
              <Award size={18} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
