
import { Routes, Route } from "react-router-dom";
import DietitianDashboard from "../pages/dietitian/DietitianDashboard";
import Patients from "../pages/dietitian/Patients";
import PatientProfile from "../pages/dietitian/PatientProfile";
import DietPlans from "../pages/dietitian/DietPlans";
import PlanDetails from "../pages/dietitian/PlanDetails";
import EditDietPlan from "../pages/dietitian/EditDietPlan";
import CreateDietPlan from "../pages/dietitian/CreateDietPlan";
import PlanApproval from "../pages/dietitian/PlanApproval";
import RequirementCalculator from "../pages/dietitian/RequirementCalculator";
import Requirements from "../pages/dietitian/Requirements";
import Assessment from "../pages/dietitian/Assessment";
import NewAssessment from "../pages/dietitian/NewAssessment";
import AssessmentHistory from "../pages/dietitian/AssessmentHistory";
import Reassessment from "../pages/dietitian/Reassessment";
import RealityScore from "../pages/dietitian/RealityScore";
import BarrierAnalysis from "../pages/dietitian/BarrierAnalysis";
import AdaptiveEngine from "../pages/dietitian/AdaptiveEngine";
import RecommendationReview from "../pages/dietitian/RecommendationReview";
import DigitalTwin from "../pages/dietitian/DigitalTwin";
import PlannedVsActual from "../pages/dietitian/PlannedVsActual";
import Measurements from "../pages/dietitian/Measurements";
import FoodDatabase from "../pages/dietitian/FoodDatabase";
import FoodDetails from "../pages/dietitian/FoodDetails";
import FoodLogs from "../pages/dietitian/FoodLogs";
import Adherence from "../pages/dietitian/Adherence";
import Profile from "../pages/dietitian/Profile";
import EditProfile from "../pages/dietitian/EditProfile";
import Notifications from "../pages/dietitian/Notifications";

export default function DietitianRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DietitianDashboard />} />
      <Route path="/dashboard" element={<DietitianDashboard />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/patients/:id" element={<PatientProfile />} />
      <Route path="/plans" element={<DietPlans />} />
      <Route path="/plans/:id" element={<PlanDetails />} />
      <Route path="/plans/:id/edit" element={<EditDietPlan />} />
      <Route path="/create-plan" element={<CreateDietPlan />} />
      <Route path="/plan-approval" element={<PlanApproval />} />
      <Route path="/calculator" element={<RequirementCalculator />} />
      <Route path="/requirements" element={<Requirements />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/new-assessment" element={<NewAssessment />} />
      <Route path="/assessment-history" element={<AssessmentHistory />} />
      <Route path="/reassessment" element={<Reassessment />} />
      <Route path="/reality-score" element={<RealityScore />} />
      <Route path="/barriers" element={<BarrierAnalysis />} />
      <Route path="/adaptive-engine" element={<AdaptiveEngine />} />
      <Route path="/recommendation-review" element={<RecommendationReview />} />
      <Route path="/digital-twin" element={<DigitalTwin />} />
      <Route path="/planned-vs-actual" element={<PlannedVsActual />} />
      <Route path="/measurements" element={<Measurements />} />
      <Route path="/food-database" element={<FoodDatabase />} />
      <Route path="/food-details/:id" element={<FoodDetails />} />
      <Route path="/food-logs" element={<FoodLogs />} />
      <Route path="/adherence" element={<Adherence />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}
