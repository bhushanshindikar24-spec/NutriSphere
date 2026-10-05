
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

export default function MacroChart({ carbs = 0, protein = 0, fat = 0 }) {
  const data = [
    { name: "Carbs", value: Math.round(carbs) },
    { name: "Protein", value: Math.round(protein) },
    { name: "Fat", value: Math.round(fat) },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
        No macronutrient data logged.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}g`, name]}
            contentStyle={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
