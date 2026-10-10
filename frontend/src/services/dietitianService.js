import api from "./api";

export const getDietitianProfile = () => 
  api.get("/users/me").then(r => r.data.data);

export const updateDietitianProfile = (data) => 
  api.put("/users/me", data).then(r => r.data.data);

export const getDietitianPatients = () => 
  api.get("/assignments/dietitian/patients").then(r => r.data.data);

export default {
  getDietitianProfile,
  updateDietitianProfile,
  getDietitianPatients,
};
