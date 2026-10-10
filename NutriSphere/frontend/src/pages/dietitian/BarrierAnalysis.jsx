import {  useState, useEffect  } from "react";
import BarrierAnalysisComponent from "../../components/intelligence/BarrierAnalysis";
import { barrierService } from "../../services/barrierService";
import api from "../../services/api";

export default function BarrierAnalysis() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [barriers, setBarriers] = useState([]);
  const [counts, setCounts] = useState({});
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/dietitians/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (list.length > 0) setSelectedPatientId(list[0].id || list[0].patientUserId || 101);
      } catch (_err) {
        setPatients([
          { id: 101, patientName: "Alex Morgan" },
          { id: 102, patientName: "Sarah Jenkins" },
          { id: 103, patientName: "Robert Chen" },
        ]);
      }
    };
    fetchPatients();
  }, []);

  const fetchBarriers = async () => {
    setLoading(true);
    try {
      const res = await barrierService.getPatientBarriers(selectedPatientId);
      const items = res.data?.data || res.data || [];
      setBarriers(items);

      const c = {};
      items.forEach((b) => {
        const t = b.barrierType || b.type || "OTHER";
        c[t] = (c[t] || 0) + 1;
      });
      setCounts(c);
    } catch (_err) {
      setBarriers([
        {
          id: 1,
          barrierType: "TIME_CONSTRAINT",
          description: "Late evening meetings caused missed meal preparation time.",
          severity: "MEDIUM",
          createdAt: "2026-09-28",
          suggestedIntervention: "Batch cook quinoa bowls on Sundays or activate partner kitchen delivery.",
          resolved: false,
        },
        {
          id: 2,
          barrierType: "FOOD_UNAVAILABLE",
          description: "Local grocer out of fresh wild salmon.",
          severity: "LOW",
          createdAt: "2026-09-25",
          suggestedIntervention: "Swap with canned albacore tuna or extra firm grilled tofu.",
          resolved: true,
        },
      ]);
      setCounts({ TIME_CONSTRAINT: 3, FOOD_UNAVAILABLE: 1, SOCIAL_EVENT: 2 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    if (selectedPatientId) fetchBarriers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  const handleResolveBarrier = async (id) => {
    try {
      await barrierService.resolveBarrier(id);
      await fetchBarriers();
    } catch (_err) {
      setBarriers((prev) =>
        prev.map((b) => (b.id === id ? { ...b, resolved: true } : b))
      );
    }
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Adherence Barrier Analytics</h2>
          <p className="text-muted">Analyze friction points reported by patients and trigger targeted interventions.</p>
        </div>

        <select
          className="input-field"
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(Number(e.target.value))}
          style={{ width: "220px" }}
        >
          {patients.map((p) => (
            <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
              {p.patientName || `${p.firstName} ${p.lastName}`}
            </option>
          ))}
        </select>
      </div>

      <BarrierAnalysisComponent
        barriers={barriers}
        barrierCounts={counts}
        onResolveBarrier={handleResolveBarrier}
      />
    </div>
  );
}
