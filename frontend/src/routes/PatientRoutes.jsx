import { Routes, Route } from "react-router-dom";
import PatientDashboard from "../pages/patient/PatientDashboard";
import DietPlan from "../pages/patient/DietPlan";
import LogFood from "../pages/patient/LogFood";
import FoodLogging from "../pages/patient/FoodLogging";
import WaterLogging from "../pages/patient/WaterLogging";
import PlannedVsActual from "../pages/patient/PlannedVsActual";
import FoodAlternatives from "../pages/patient/FoodAlternatives";
import HomeFoodMode from "../pages/patient/HomeFoodMode";
import HomeFoodInventory from "../pages/patient/HomeFoodInventory";
import MealDeviation from "../pages/patient/MealDeviation";
import MealDetails from "../pages/patient/MealDetails";
import DigitalTwin from "../pages/patient/DigitalTwin";
import NutritionAnalysis from "../pages/patient/NutritionAnalysis";
import Progress from "../pages/patient/Progress";
import MyDietitian from "../pages/patient/MyDietitian";
import MyDoctor from "../pages/patient/MyDoctor";
import Directory from "../pages/patient/Directory";
import Profile from "../pages/patient/Profile";
import EditProfile from "../pages/patient/EditProfile";
import Settings from "../pages/common/Settings";
import Notifications from "../pages/patient/Notifications";
import Reports from "../pages/patient/Reports";
import UploadReport from "../pages/patient/UploadReport";
import LabProgress from "../pages/patient/LabProgress";
import PatientConsultations from "../pages/patient/Consultations";
import MedicalConditions from "../pages/patient/MedicalConditions";
import MedicalHistory from "../pages/patient/MedicalHistory";
import DailyReport from "../pages/patient/DailyReport";
import NutritionCalculator from "../pages/patient/NutritionCalculator";

// Patient Hotel & Meal Delivery
import HotelMenu from "../pages/patient/hotel/Menu";
import HotelMealDetails from "../pages/patient/hotel/MealDetails";
import HotelCart from "../pages/patient/hotel/Cart";
import HotelCheckout from "../pages/patient/hotel/Checkout";
import HotelOrders from "../pages/patient/hotel/Orders";
import HotelOrderDetails from "../pages/patient/hotel/OrderDetails";
import HotelOrderHistory from "../pages/patient/hotel/OrderHistory";
import KitchenProfile from "../pages/patient/hotel/KitchenProfile";
import CustomMealRequest from "../pages/patient/hotel/CustomMealRequest";

export default function PatientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PatientDashboard />} />
      <Route path="/dashboard" element={<PatientDashboard />} />
      <Route path="/diet-plan" element={<DietPlan />} />
      <Route path="/daily-report" element={<DailyReport />} />
      <Route path="/nutrition-calculator" element={<NutritionCalculator />} />
      <Route path="/calculator" element={<NutritionCalculator />} />
      <Route path="/food-restrictions" element={<MedicalConditions />} />
      <Route path="/conditions" element={<MedicalConditions />} />
      <Route path="/medical-history" element={<MedicalHistory />} />
      <Route path="/log-food" element={<LogFood />} />
      <Route path="/food-logging" element={<FoodLogging />} />
      <Route path="/water-logging" element={<WaterLogging />} />
      <Route path="/planned-vs-actual" element={<PlannedVsActual />} />
      <Route path="/food-alternatives" element={<FoodAlternatives />} />
      <Route path="/home-food" element={<HomeFoodMode />} />
      <Route path="/home-food/inventory" element={<HomeFoodInventory />} />
      <Route path="/barriers" element={<MealDeviation />} />
      <Route path="/meal-deviation" element={<MealDeviation />} />
      <Route path="/meals/:id" element={<MealDetails />} />
      <Route path="/digital-twin" element={<DigitalTwin />} />
      <Route path="/nutrition-analysis" element={<NutritionAnalysis />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/directory" element={<Directory />} />
      <Route path="/my-dietitian" element={<MyDietitian />} />
      <Route path="/dietitian" element={<MyDietitian />} />
      <Route path="/my-doctor" element={<MyDoctor />} />
      <Route path="/doctor" element={<MyDoctor />} />
      <Route path="/consultations" element={<PatientConsultations />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/upload" element={<UploadReport />} />
      <Route path="/lab-progress" element={<LabProgress />} />

      {/* Hotel & Delivery */}
      <Route path="/hotel" element={<HotelMenu />} />
      <Route path="/hotel/menu" element={<HotelMenu />} />
      <Route path="/hotel/meals/:id" element={<HotelMealDetails />} />
      <Route path="/hotel/cart" element={<HotelCart />} />
      <Route path="/hotel/checkout" element={<HotelCheckout />} />
      <Route path="/hotel/orders" element={<HotelOrders />} />
      <Route path="/hotel/orders/:id" element={<HotelOrderDetails />} />
      <Route path="/hotel/order-history" element={<HotelOrderHistory />} />
      <Route path="/hotel/kitchen-profile" element={<KitchenProfile />} />
      <Route path="/hotel/custom-request" element={<CustomMealRequest />} />
    </Routes>
  );
}
