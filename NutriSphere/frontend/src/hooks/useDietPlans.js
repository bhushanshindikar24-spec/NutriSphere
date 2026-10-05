import { useState, useEffect, useCallback } from "react";
import dietPlanService from "../services/dietPlanService";

export const useDietPlans = (patientUserId) => {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (patientUserId) {
        data = await dietPlanService.getPatientDietPlans(patientUserId);
      } else {
        data = await dietPlanService.getMyDietPlans();
      }
      setPlans(data || []);
      if (data && data.length > 0) {
        setActivePlan(data[0]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [patientUserId]);

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlans();
  }, [fetchPlans]);

  return { plans, activePlan, loading, error, refetch: fetchPlans };
};

export default useDietPlans;
