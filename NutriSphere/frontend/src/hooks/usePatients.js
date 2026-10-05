import { useState, useEffect } from "react";
import assignmentService from "../services/assignmentService";
import { useAuth } from "./useAuth";

export const usePatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      let data = [];
      if (user.role === "DOCTOR") {
        data = await assignmentService.getDoctorPatients();
      } else if (user.role === "DIETITIAN") {
        data = await assignmentService.getDietitianPatients();
      }
      setPatients(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPatients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { patients, loading, error, refetch: fetchPatients };
};

export default usePatients;
