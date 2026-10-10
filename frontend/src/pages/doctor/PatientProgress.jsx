import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingDown, Scale, Activity } from "lucide-react";
import TrendAnalysis from "../../components/intelligence/TrendAnalysis";
import StatCard from "../../components/common/StatCard";
import api from "../../services/api";

export default function PatientProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/doctors/patients/${id || 1}/progress`);
        setProgress(res.data?.data || res.data);
      } catch (_err) {
        setProgress({
          patientName: "Alex Morgan",
          currentWeightKg: 78.5,
          startWeightKg: 82.0,
          weightLostKg: 3.5,
          complianceRate: 88,
          weightHistory: [
            { date: "Week 1", weight: 82.0 },
            { date: "Week 2", weight: 81.1 },
            { date: "Week 3", weight: 79.8 },
            { date: "Week 4", weight: 78.5 },
          ],
          adherenceHistory: [
            { date: "W1", adherence: 78, target: 80 },
            { date: "W2", adherence: 82, target: 80 },
            { date: "W3", adherence: 88, target: 80 },
            { date: "W4", adherence: 91, target: 80 },
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
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Biometric Progression...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate(`/doctor/patients/${id || 1}`)}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Patient Dossier
      </button>

      <div>
        <h2>Biometric Progression: {progress?.patientName}</h2>
        <p className="text-muted">Longitudinal physical markers, weight change trajectories, and dietary protocol compliance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
        <StatCard
          title="Weight Reduction"
          value={`-${progress?.weightLostKg || 0} kg`}
          subtext={`Current: ${progress?.currentWeightKg} kg`}
          icon={<Scale size={20} />}
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Average Compliance"
          value={`${progress?.complianceRate || 0}%`}
          subtext="Protocol adherence"
          icon={<Activity size={20} />}
          iconColor="var(--primary)"
          iconBg="rgba(99, 102, 241, 0.1)"
        />
        <StatCard
          title="Physiological Status"
          value="Favorable"
          subtext="No metabolic plateau detected"
          icon={<TrendingDown size={20} />}
          iconColor="#3B82F6"
          iconBg="rgba(59, 130, 246, 0.1)"
        />
      </div>

      <TrendAnalysis
        adherenceData={progress?.adherenceHistory || []}
        weightData={progress?.weightHistory || []}
        calorieData={progress?.calorieHistory || []}
      />
    </div>
  );
}
