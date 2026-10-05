
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function CalorieChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
        No calorie data available for this range.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          <Bar dataKey="actual" name="Actual Calories" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="target" name="Target Calories" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
