import { useState, useEffect } from "react";
import digitalTwinService from "../services/digitalTwinService";
import waterLogService from "../services/waterLogService";
import { getTodayDate } from "../utils/dateUtils";

export const useNutrition = (patientUserId = null) => {
  const [twin, setTwin] = useState(null);
  const [hydration, setHydration] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNutrition = async () => {
    try {
      setLoading(true);
      const twinData = patientUserId
        ? await digitalTwinService.getDigitalTwinForPatient(patientUserId)
        : await digitalTwinService.getMyDigitalTwin();
      setTwin(twinData);

      if (!patientUserId) {
        const waterData = await waterLogService.getWaterSummary(getTodayDate());
        setHydration(waterData);
      }
    } catch (err) {
      console.error("Failed to fetch nutrition info", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNutrition();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientUserId]);

  return { twin, hydration, loading, refetch: fetchNutrition };
};

export default useNutrition;
