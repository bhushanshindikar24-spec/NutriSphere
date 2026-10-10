import api from "./api";

export const getProfile = () => 
  api.get("/users/profile").then(r => r.data.data);

export const updateProfile = (data) => 
  api.put("/users/profile", data).then(r => r.data.data);

export const changePassword = (data) => 
  api.post("/users/change-password", data).then(r => r.data.data);

export default {
  getProfile,
  updateProfile,
  changePassword,
};
