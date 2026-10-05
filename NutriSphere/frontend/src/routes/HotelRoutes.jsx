
import { Routes, Route } from "react-router-dom";
import HotelDashboard from "../pages/hotel/HotelDashboard";
import Menu from "../pages/hotel/Menu";
import AddMeal from "../pages/hotel/AddMeal";
import EditMeal from "../pages/hotel/EditMeal";
import MealDetails from "../pages/hotel/MealDetails";
import Orders from "../pages/hotel/Orders";
import OrderDetails from "../pages/hotel/OrderDetails";
import ManageOrders from "../pages/hotel/ManageOrders";
import ManageCategories from "../pages/hotel/ManageCategories";
import ManageAvailability from "../pages/hotel/ManageAvailability";
import Profile from "../pages/hotel/Profile";
import EditProfile from "../pages/hotel/EditProfile";
import Notifications from "../pages/hotel/Notifications";

export default function HotelRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HotelDashboard />} />
      <Route path="/dashboard" element={<HotelDashboard />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/add-meal" element={<AddMeal />} />
      <Route path="/edit-meal/:id" element={<EditMeal />} />
      <Route path="/meals/:id" element={<MealDetails />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/manage-orders" element={<ManageOrders />} />
      <Route path="/manage-categories" element={<ManageCategories />} />
      <Route path="/manage-availability" element={<ManageAvailability />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}
