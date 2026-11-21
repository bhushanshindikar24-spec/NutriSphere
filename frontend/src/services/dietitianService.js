import api from "./api";

export const getDietitianProfile = () => 
  api.get("/dietitians/profile").then(r => r.data.data);

export const updateDietitianProfile = (data) => 
  api.put("/dietitians/profile", data).then(r => r.data.data);

export const getDietitianPatients = () => 
  api.get("/assignments/dietitian/patients").then(r => r.data.data);

export default {
  getDietitianProfile,
  updateDietitianProfile,
  getDietitianPatients,
};
