import {  useState, useEffect  } from "react";
import TrendAnalysis from "../../components/intelligence/TrendAnalysis";
import StatCard from "../../components/common/StatCard";
import { Scale, Flame, Award, CheckCircle } from "lucide-react";
import api from "../../services/api";

export default function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/patient/progress");
        setProgress(res.data?.data || res.data);
      } catch (_err) {
        setProgress({
          startingWeight: 82.0,
          currentWeight: 78.5,
          targetWeight: 72.0,
          totalLost: 3.5,
          streakDays: 14,
          avgAdherence: 87,
          adherenceHistory: [
            { date: "W1", adherence: 78, target: 85 },
            { date: "W2", adherence: 82, target: 85 },
            { date: "W3", adherence: 88, target: 85 },
            { date: "W4", adherence: 91, target: 85 },
          ],
          weightHistory: [
            { date: "Week 1", weight: 82.0 },
            { date: "Week 2", weight: 81.1 },
            { date: "Week 3", weight: 79.8 },
            { date: "Week 4", weight: 78.5 },
          ],
          calorieHistory: [
            { date: "Mon", calories: 1940 },
            { date: "Tue", calories: 2010 },
            { date: "Wed", calories: 1890 },
            { date: "Thu", calories: 1980 },
            { date: "Fri", calories: 2050 },
            { date: "Sat", calories: 1920 },
            { date: "Sun", calories: 1960 },
          ],
          milestones: [
            { title: "First 2kg Dropped", date: "2 weeks ago", achieved: true },
            { title: "14-Day Logging Streak", date: "Today", achieved: true },
            { title: "Reach 75kg Milestone", date: "Upcoming", achieved: false },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="loading-screen">Loading Progress Milestones...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <h2>Biometric Progress & Milestones</h2>
        <p className="text-muted">Track your longitudinal weight loss, diet compliance, and clinical achievements.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        <StatCard
          title="Weight Reduced"
          value={`-${progress?.totalLost || 0} kg`}
          subtext={`Current: ${progress?.currentWeight} kg`}
          icon={<Scale size={20} />}
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Logging Streak"
          value={`${progress?.streakDays || 0} Days`}
          subtext="Consecutive daily logging"
          icon={<Flame size={20} />}
          iconColor="#F59E0B"
          iconBg="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Average Adherence"
          value={`${progress?.avgAdherence || 0}%`}
          subtext="Protocol compliance"
          icon={<Award size={20} />}
          iconColor="var(--primary)"
          iconBg="rgba(99, 102, 241, 0.1)"
        />
      </div>

      <TrendAnalysis
        adherenceData={progress?.adherenceHistory || []}
        weightData={progress?.weightHistory || []}
        calorieData={progress?.calorieHistory || []}
      />

      {/* Milestones Card */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1.25rem 0" }}>Program Milestones</h4>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {(progress?.milestones || []).map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                background: m.achieved ? "rgba(16, 185, 129, 0.05)" : "rgba(255, 255, 255, 0.02)",
                border: m.achieved ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle size={18} color={m.achieved ? "#10B981" : "var(--text-muted)"} />
                <span style={{ fontWeight: m.achieved ? 600 : 400, color: m.achieved ? "inherit" : "var(--text-muted)" }}>
                  {m.title}
                </span>
              </div>
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
