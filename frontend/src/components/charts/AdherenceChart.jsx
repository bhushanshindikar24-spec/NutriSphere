
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdherenceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
        No adherence records available.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} unit="%" />
          <Tooltip
            formatter={(value) => [`${value}%`, "Adherence"]}
            contentStyle={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10B981" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
