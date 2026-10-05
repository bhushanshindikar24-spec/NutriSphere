
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function WeightTrendChart({ actualData = [], projectedData = [] }) {
  // Combine actual and projected points
  const combinedMap = {};

  actualData.forEach((d) => {
    combinedMap[d.date] = { date: d.date, actualWeight: d.weight };
  });

  projectedData.forEach((d) => {
    if (!combinedMap[d.date]) {
      combinedMap[d.date] = { date: d.date };
    }
    combinedMap[d.date].projectedWeight = d.weight;
  });

  const data = Object.values(combinedMap);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
        No weight trend data logged yet.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} unit="kg" />
          <Tooltip
            formatter={(value, name) => [`${value} kg`, name]}
            contentStyle={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          <Line
            type="monotone"
            dataKey="actualWeight"
            name="Actual Weight"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 4, fill: "#4F46E5" }}
          />
          <Line
            type="monotone"
            dataKey="projectedWeight"
            name="Digital Twin Projection"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: "#F59E0B" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
