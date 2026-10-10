import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.data.accessToken) {
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }
  return response.data.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
