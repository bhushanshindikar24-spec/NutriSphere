import api from "./api";

export const logWater = (data) => 
  api.post("/water-logs", data);

export const getWaterSummary = (date) => 
  api.get("/water-logs/summary", { params: { date } });

export const getTodayWaterLogs = () =>
  api.get("/water-logs/today");

export const waterLogService = {
  logWater,
  getWaterSummary,
  getTodayWaterLogs,
};

export default waterLogService;
