
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function RealityScoreChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
          <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
          <Tooltip formatter={(val) => [`${val} / 100`, 'Reality Score']} contentStyle={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }} />
          <Line type="monotone" dataKey="overallScore" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
