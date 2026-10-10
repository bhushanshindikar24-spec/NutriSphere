import {  useState, useEffect  } from "react";
import MedicalHistoryCard from "../../components/medical/MedicalHistoryCard";
import api from "../../services/api";

export default function MedicalHistory() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const res = await api.get("/doctors/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (list.length > 0) setSelectedPatientId(list[0].id || list[0].patientUserId || 101);
      } catch (_err) {
        setPatients([
          { id: 101, patientName: "Alex Morgan" },
          { id: 102, patientName: "Sarah Jenkins" },
        ]);
      }
    };
    fetchCohort();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/medical/history?patientId=${selectedPatientId}`);
      setHistoryItems(res.data?.data || res.data || []);
    } catch (_err) {
      setHistoryItems([
        {
          id: 1,
          eventTitle: "Appendectomy",
          category: "SURGERY",
          eventDate: "2018-05-12",
          description: "Laparoscopic appendectomy performed with zero postoperative complications.",
        },
        {
          id: 2,
          eventTitle: "Family History of CAD",
          category: "GENETIC_RISK",
          eventDate: "2024-01-10",
          description: "Paternal myocardial infarction at age 54. Primary motivation for preventive nutrition.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    if (selectedPatientId) fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Patient Medical History Timeline</h2>
          <p className="text-muted">Longitudinal medical background, family history, and past interventions.</p>
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

      <div style={{ display: "grid", gap: "1rem" }}>
        {historyItems.map((item) => (
          <MedicalHistoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
