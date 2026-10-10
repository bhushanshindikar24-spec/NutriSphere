
import DigitalTwinViewer from "./DigitalTwinViewer";

export default function DigitalTwin({
  twinData,
  onRunSimulation,
  isSimulating = false,
}) {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {onRunSimulation && (
        <div
          className="glass-panel"
          style={{
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>Metabolic Digital Twin Simulation</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.8125rem" }}>
              Dynamic bioenergetic simulation based on recent intake, energy expenditure, and adherence.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={onRunSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? "Simulating..." : "Recalculate Projection"}
          </button>
        </div>
      )}

      <DigitalTwinViewer twinData={twinData} />
    </div>
  );
}
