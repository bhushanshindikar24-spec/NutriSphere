

export default function RealityScoreGauge({ score = 0, interpretation = "", dimensionScores = {} }) {
  const getScoreColor = (val) => {
    if (val >= 75) return "#10B981";
    if (val >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const color = getScoreColor(score);

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          Overall Reality Score
        </p>

        {/* Circular Progress Gauge */}
        <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto" }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="58"
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r="58"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={2 * Math.PI * 58 * (1 - Math.min(100, Math.max(0, score)) / 100)}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "2rem", fontWeight: 800, color }}>
              {Math.round(score)}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "-4px" }}>
              / 100
            </span>
          </div>
        </div>

        {interpretation && (
          <p style={{ marginTop: "1rem", fontWeight: 600, color, fontSize: "0.9375rem" }}>
            {interpretation}
          </p>
        )}
      </div>

      {dimensionScores && Object.keys(dimensionScores).length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
          <h4 style={{ fontSize: "0.875rem", marginBottom: "0.75rem", color: "var(--text-muted)" }}>
            Dimensional Feasibility
          </h4>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {Object.entries(dimensionScores).map(([dim, val]) => (
              <div key={dim}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                  <span>{dim}</span>
                  <span style={{ fontWeight: 600 }}>{val != null ? Math.round(val) : 0}%</span>
                </div>
                <div style={{ height: "4px", background: "var(--border-color)", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, Math.max(0, val || 0))}%`,
                      background: getScoreColor(val || 0),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
