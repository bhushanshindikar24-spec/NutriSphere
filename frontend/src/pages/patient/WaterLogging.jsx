import {  useState, useEffect  } from "react";
import { Droplets, Plus } from "lucide-react";
import { waterLogService } from "../../services/waterLogService";

export default function WaterLogging() {
  const [logs, setLogs] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [targetMl, setTargetMl] = useState(2500);
  const [customMl, setCustomMl] = useState("");
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchWater = async () => {
    try {
      const res = await waterLogService.getTodayWaterLogs();
      const items = res.data?.data || res.data || [];
      setLogs(items);
      const sum = items.reduce((acc, log) => acc + (log.amountMl || log.amount || 0), 0);
      setTodayTotal(sum);
    } catch (err) {
      console.error("Failed to load water logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     
    fetchWater();
  }, []);

  const handleAddWater = async (amount) => {
    const ml = Number(amount);
    if (!ml || ml <= 0) return;
    setSubmitting(true);
    try {
      await waterLogService.logWater({ amountMl: ml });
      await fetchWater();
      setCustomMl("");
    } catch (err) {
      console.error("Failed to log water", err);
      alert("Failed to log hydration.");
    } finally {
      setSubmitting(false);
    }
  };

  const pct = Math.min(100, Math.round((todayTotal / targetMl) * 100));

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Hydration Tracker</h2>
        <p className="text-muted">Track your daily water intake to maintain cellular hydration and metabolic health.</p>
      </div>

      {/* Progress Card */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)", textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", marginBottom: "1rem" }}>
          <Droplets size={40} />
        </div>

        <h3 style={{ fontSize: "2.25rem", margin: "0 0 0.25rem 0", color: "#3B82F6" }}>
          {todayTotal} <span style={{ fontSize: "1.25rem", color: "var(--text-muted)", fontWeight: 400 }}>/ {targetMl} mL</span>
        </h3>
        <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
          {pct}% of daily target reached
        </p>

        <div style={{ height: "10px", background: "var(--border-color)", borderRadius: "5px", overflow: "hidden", margin: "1.5rem 0 1rem 0" }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
              borderRadius: "5px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>Quick Add Hydration</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
          {[
            { label: "Glass (250 mL)", amount: 250 },
            { label: "Bottle (500 mL)", amount: 500 },
            { label: "Flask (750 mL)", amount: 750 },
          ].map((item) => (
            <button
              key={item.amount}
              className="btn btn-outline"
              disabled={submitting}
              onClick={() => handleAddWater(item.amount)}
              style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
            >
              <Droplets size={20} color="#3B82F6" />
              <strong style={{ fontSize: "0.9rem" }}>+{item.amount} mL</strong>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddWater(customMl);
          }}
          style={{ display: "flex", gap: "0.75rem" }}
        >
          <input
            type="number"
            className="input-field"
            placeholder="Custom amount in mL (e.g. 350)"
            value={customMl}
            onChange={(e) => setCustomMl(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting || !customMl}>
            <Plus size={16} /> Add Custom
          </button>
        </form>
      </div>

      {/* Recent Hydration Logs */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>Today's Hydration Entries</h4>
        {logs.length === 0 ? (
          <p className="text-muted" style={{ textAlign: "center", margin: 0, padding: "1rem" }}>
            No water logged yet today. Drink a glass of water to get started!
          </p>
        ) : (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {logs.map((log, idx) => (
              <div
                key={log.id || idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Droplets size={16} color="#3B82F6" />
                  <span style={{ fontWeight: 600 }}>{log.amountMl || log.amount} mL</span>
                </div>
                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {log.loggedAt ? new Date(log.loggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
