
import RealityScoreGauge from "./RealityScoreGauge";

export default function RealityScore({
  score = 0,
  breakdown = {},
  dimensionScores = {},
  interpretation = "",
  onRecalculate,
  isLoading = false,
}) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {onRecalculate && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn btn-sm btn-outline"
            onClick={onRecalculate}
            disabled={isLoading}
          >
            {isLoading ? "Recalculating..." : "Recalculate Reality Score"}
          </button>
        </div>
      )}
      <RealityScoreGauge
        score={score}
        interpretation={interpretation}
        dimensionScores={dimensionScores || breakdown}
      />
    </div>
  );
}
