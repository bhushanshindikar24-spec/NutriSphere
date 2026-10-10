import api from "./api";

export const getInventory = () => 
  api.get("/home-food/inventory");

export const addInventoryItem = (data) => 
  api.post("/home-food/inventory", data);

export const removeInventoryItem = (id) => 
  api.delete(`/home-food/inventory/${id}`);

export const getSuggestions = () => 
  api.get("/home-food/suggestions");

export const getMealSuggestions = () =>
  api.get("/home-food/suggestions");

export const generateSuggestions = (data) =>
  api.post("/home-food/suggestions/generate", data);

export const homeFoodService = {
  getInventory,
  addInventoryItem,
  removeInventoryItem,
  getSuggestions,
  getMealSuggestions,
  generateSuggestions,
};

export default homeFoodService;
