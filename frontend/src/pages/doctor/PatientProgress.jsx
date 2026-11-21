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
    // Assembled from the patient's recorded measurements and daily progress entries
    const fetchProgress = async () => {
      try {
        const [patientRes, measRes, progRes] = await Promise.allSettled([
          api.get(`/doctors/patients/${id}`),
          api.get(`/nutrition/progress/measurements/${id}`),
          api.get(`/nutrition/progress/${id}`),
        ]);
        const patient = patientRes.status === "fulfilled" ? patientRes.value.data?.data : null;
        const measurements = (measRes.status === "fulfilled" ? measRes.value.data?.data || [] : [])
          .filter((m) => m.weightKg != null)
          .sort((a, b) => String(a.measurementDate).localeCompare(String(b.measurementDate)));
        const entries = (progRes.status === "fulfilled" ? progRes.value.data?.data || [] : [])
          .sort((a, b) => String(a.recordDate).localeCompare(String(b.recordDate)));

        const first = measurements[0]?.weightKg;
        const latest = measurements[measurements.length - 1]?.weightKg;
        const adherenceValues = entries.map((e) => e.adherencePercent).filter((v) => v != null);
        setProgress({
          patientName: patient?.fullName || [patient?.firstName, patient?.lastName].filter(Boolean).join(" "),
          currentWeightKg: latest ?? null,
          weightChangeKg: first != null && latest != null ? Math.round((latest - first) * 10) / 10 : null,
          measurementCount: measurements.length,
          complianceRate: adherenceValues.length
            ? Math.round(adherenceValues.reduce((t, v) => t + v, 0) / adherenceValues.length)
            : null,
          adherenceHistory: entries.filter((e) => e.adherencePercent != null).map((e) => ({ date: e.recordDate, score: e.adherencePercent })),
          weightHistory: measurements.map((m) => ({ date: m.measurementDate, weight: m.weightKg })),
          calorieHistory: entries.filter((e) => e.caloriesConsumed != null).map((e) => ({ date: e.recordDate, calories: e.caloriesConsumed })),
        });
      } catch (_err) {
        setProgress(null);
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
        onClick={() => navigate(`/doctor/patients/${id}`)}
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
          title="Weight Change"
          value={progress?.weightChangeKg == null ? "No data" : `${progress.weightChangeKg > 0 ? "+" : ""}${progress.weightChangeKg} kg`}
          subtext={progress?.currentWeightKg != null ? `Current: ${progress.currentWeightKg} kg` : "No weight measurements yet"}
          icon={<Scale size={20} />}
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Average Compliance"
          value={progress?.complianceRate == null ? "No data" : `${progress.complianceRate}%`}
          subtext="From daily progress records"
          icon={<Activity size={20} />}
          iconColor="var(--primary)"
          iconBg="rgba(99, 102, 241, 0.1)"
        />
        <StatCard
          title="Measurements Recorded"
          value={`${progress?.measurementCount ?? 0}`}
          subtext="Anthropometric entries on file"
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
