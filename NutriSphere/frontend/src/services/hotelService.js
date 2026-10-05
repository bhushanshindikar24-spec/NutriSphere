import api from "./api";

// Meals & Menu
export const addMeal = (data) => 
  api.post("/hotel/meals", data);

export const getHotelMenu = () => 
  api.get("/hotel/meals");

export const getAllPublicMeals = () => 
  api.get("/hotel/meals/public");

export const getAvailableMeals = () =>
  api.get("/hotel/meals/available");

export const getMealById = (id) => 
  api.get(`/hotel/meals/${id}`);

export const updateMeal = (id, data) => 
  api.put(`/hotel/meals/${id}`, data);

// Orders
export const placeOrder = (data) => 
  api.post("/orders", data);

export const getMyOrders = () => 
  api.get("/orders/my");

export const getHotelOrders = () => 
  api.get("/orders/hotel");

export const getOrderById = (id) => 
  api.get(`/orders/${id}`);

export const updateOrderStatus = (id, status) => 
  api.patch(`/orders/${id}/status`, { status });

// Profile & Categories
export const getHotelProfile = () => 
  api.get("/hotel/profile");

export const updateHotelProfile = (data) => 
  api.put("/hotel/profile", data);

export const getCategories = () => 
  api.get("/hotel/categories");

export const hotelService = {
  addMeal,
  getHotelMenu,
  getAllPublicMeals,
  getAvailableMeals,
  getMealById,
  updateMeal,
  placeOrder,
  getMyOrders,
  getHotelOrders,
  getOrderById,
  updateOrderStatus,
  getHotelProfile,
  updateHotelProfile,
  getCategories,
};

export default hotelService;
