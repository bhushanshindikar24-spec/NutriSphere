
import { CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function LabValueTable({ labValues = [] }) {
  if (!labValues || labValues.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
        No laboratory values recorded for this test.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-muted)" }}>
            <th style={{ padding: "0.75rem 0.5rem" }}>Biomarker</th>
            <th style={{ padding: "0.75rem 0.5rem" }}>Result</th>
            <th style={{ padding: "0.75rem 0.5rem" }}>Unit</th>
            <th style={{ padding: "0.75rem 0.5rem" }}>Reference Range</th>
            <th style={{ padding: "0.75rem 0.5rem" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {labValues.map((row, idx) => {
            const isHigh = row.flag === "HIGH" || (row.referenceMax != null && row.value > row.referenceMax);
            const isLow = row.flag === "LOW" || (row.referenceMin != null && row.value < row.referenceMin);
            const isAbnormal = row.isAbnormal || isHigh || isLow;

            return (
              <tr
                key={row.id || idx}
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  background: isAbnormal ? "rgba(239, 68, 68, 0.05)" : "transparent",
                }}
              >
                <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>
                  {row.markerName || row.testCode}
                </td>
                <td style={{ padding: "0.75rem 0.5rem", fontWeight: isAbnormal ? 700 : 400, color: isAbnormal ? "#EF4444" : "inherit" }}>
                  {row.value}
                </td>
                <td style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)" }}>
                  {row.unit || "--"}
                </td>
                <td style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)" }}>
                  {row.referenceMin != null && row.referenceMax != null
                    ? `${row.referenceMin} - ${row.referenceMax}`
                    : row.referenceRange || "Standard"}
                </td>
                <td style={{ padding: "0.75rem 0.5rem" }}>
                  {isHigh ? (
                    <span style={{ color: "#EF4444", display: "inline-flex", alignItems: "center", gap: "0.2rem", fontWeight: 600, fontSize: "0.75rem" }}>
                      <ArrowUpRight size={14} /> High
                    </span>
                  ) : isLow ? (
                    <span style={{ color: "#F59E0B", display: "inline-flex", alignItems: "center", gap: "0.2rem", fontWeight: 600, fontSize: "0.75rem" }}>
                      <ArrowDownRight size={14} /> Low
                    </span>
                  ) : (
                    <span style={{ color: "#10B981", display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.75rem" }}>
                      <CheckCircle2 size={14} /> Normal
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
