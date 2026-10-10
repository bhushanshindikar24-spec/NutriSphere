import api from "./api";

export const searchFood = (query, category, page = 0, size = 20) => 
  api.get("/food", { params: { query, category, page, size } });

export const searchFoods = (query, category, page = 0, size = 20) =>
  api.get("/food", { params: { query, category, page, size } });

export const searchUSDA = (query) =>
  api.get("/integrations/fooddata/search", { params: { query } });

export const searchOpenFoodFacts = (query) =>
  api.get("/integrations/openfoodfacts/search", { params: { query } });

export const getFoodById = (id) => 
  api.get(`/food/${id}`);

export const createFood = (data) => 
  api.post("/food", data);

export const foodService = {
  searchFood,
  searchFoods,
  searchUSDA,
  searchOpenFoodFacts,
  getFoodById,
  createFood,
};

export default foodService;
