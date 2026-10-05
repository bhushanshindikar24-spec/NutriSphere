import { useState, useEffect, useCallback } from "react";
import foodLogService from "../services/foodLogService";
import { getTodayDate } from "../utils/dateUtils";

export const useFoodLogs = (date = getTodayDate(), patientUserId = null) => {
  const [logs, setLogs] = useState([]);
  const [plannedVsActual, setPlannedVsActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodLogService.getFoodLogsByDate(date, patientUserId);
      setLogs(data || []);
      const pva = await foodLogService.getPlannedVsActual(date, patientUserId);
      setPlannedVsActual(pva);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [date, patientUserId]);

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  const addLog = async (logData) => {
    const res = await foodLogService.logFood(logData);
    await fetchLogs();
    return res;
  };

  return { logs, plannedVsActual, loading, error, refetch: fetchLogs, addLog };
};

export default useFoodLogs;
