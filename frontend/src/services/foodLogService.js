import api from "./api";

export const logFood = (data) => 
  api.post("/food-logs", data);

export const getTodayFoodLogs = () => 
  api.get("/food-logs/today");

export const getFoodLogsByDate = (date, patientUserId) => 
  api.get(`/food-logs/date/${date}`, { params: { patientUserId } });

export const getFoodLogsRange = (from, to, patientUserId) => 
  api.get("/food-logs/range", { params: { from, to, patientUserId } });

export const recordDeviation = (data) => 
  api.post("/food-logs/deviations", data);

export const getPlannedVsActual = (date, patientUserId) => 
  api.get("/food-logs/planned-vs-actual", { params: { date, patientUserId } });

export const foodLogService = {
  logFood,
  getTodayFoodLogs,
  getFoodLogsByDate,
  getFoodLogsRange,
  recordDeviation,
  getPlannedVsActual,
};

export default foodLogService;
