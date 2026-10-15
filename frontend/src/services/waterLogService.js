import api from "./api";

export const logWater = (data) => 
  api.post("/water-logs", data);

export const getWaterSummary = (date) => 
  api.get("/water-logs/summary", { params: { date } });

export const getTodayWaterLogs = () =>
  api.get("/water-logs/today");

export const updateWaterLog = (id, data) =>
  api.put(`/water-logs/${id}`, data);

export const deleteWaterLog = (id) =>
  api.delete(`/water-logs/${id}`);

export const waterLogService = {
  logWater,
  getWaterSummary,
  getTodayWaterLogs,
  updateWaterLog,
  deleteWaterLog,
};

export default waterLogService;
