import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalFallDetection from "./components/GlobalFallDetection";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import DiseaseLibrary from "./pages/DiseaseLibrary";
import Medicines from "./pages/Medicines";
import Diagnostics from "./pages/Diagnostics";
import Consultations from "./pages/Consultations";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import HealthRecords from "./pages/HealthRecords";
import ProfileSettings from "./pages/ProfileSettings";
import VitalsTracker from "./pages/VitalsTracker";
import FamilyHealth from "./pages/FamilyHealth";
import EmergencySOS from "./pages/EmergencySOS";
import EmergencySettings from "./pages/EmergencySettings";
import MedicineReminder from "./pages/MedicineReminder";
import BMICalculator from "./pages/BMICalculator";
import NearbyHospitals from "./pages/NearbyHospitals";
import HealthDashboard from "./pages/HealthDashboard";
import HealthGoals from "./pages/HealthGoals";
import DietTracker from "./pages/DietTracker";
import SleepTracker from "./pages/SleepTracker";
import MoodTracker from "./pages/MoodTracker";
import HealthQuiz from "./pages/HealthQuiz";
import DrugInteractions from "./pages/DrugInteractions";
import PatientTimeline from "./pages/PatientTimeline";
import HealthScore from "./pages/HealthScore";
import HealthChallenges from "./pages/HealthChallenges";
import WaterReminder from "./pages/WaterReminder";
import BreathingExercises from "./pages/BreathingExercises";
import SymptomJournal from "./pages/SymptomJournal";
import PostureMonitor from "./pages/PostureMonitor";
import FirstAidGuide from "./pages/FirstAidGuide";
import AIHealthTwin from "./pages/AIHealthTwin";
import SkinAnalyzer from "./pages/SkinAnalyzer";
import MentalHealthSupport from "./pages/MentalHealthSupport";
import PregnancyTracker from "./pages/PregnancyTracker";
import ElderCareMonitor from "./pages/ElderCareMonitor";
import VaccinationTracker from "./pages/VaccinationTracker";
import PredictiveHealthAI from "./pages/PredictiveHealthAI";
import EmergencyGestureControl from "./pages/EmergencyGestureControl";
import MedicationSchedule from "./pages/MedicationSchedule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalFallDetection />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diseases" element={<DiseaseLibrary />} />
          <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/consultations" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
          <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/health-records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/vitals" element={<VitalsTracker />} />
          <Route path="/family" element={<FamilyHealth />} />
          <Route path="/emergency" element={<EmergencySOS />} />
          <Route path="/emergency-settings" element={<EmergencySettings />} />
          <Route path="/medicine-reminders" element={<MedicineReminder />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
          <Route path="/health-dashboard" element={<HealthDashboard />} />
          <Route path="/health-goals" element={<HealthGoals />} />
          <Route path="/diet-tracker" element={<DietTracker />} />
          <Route path="/sleep-tracker" element={<SleepTracker />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/health-quiz" element={<HealthQuiz />} />
          <Route path="/drug-interactions" element={<DrugInteractions />} />
          <Route path="/patient-timeline" element={<PatientTimeline />} />
          <Route path="/health-score" element={<HealthScore />} />
          <Route path="/health-challenges" element={<HealthChallenges />} />
          <Route path="/water-reminder" element={<WaterReminder />} />
          <Route path="/breathing-exercises" element={<BreathingExercises />} />
          <Route path="/symptom-journal" element={<SymptomJournal />} />
          <Route path="/posture-monitor" element={<PostureMonitor />} />
          <Route path="/first-aid" element={<FirstAidGuide />} />
          <Route path="/ai-health-twin" element={<AIHealthTwin />} />
          <Route path="/skin-analyzer" element={<SkinAnalyzer />} />
          <Route path="/mental-health" element={<MentalHealthSupport />} />
          <Route path="/pregnancy-tracker" element={<PregnancyTracker />} />
          <Route path="/elder-care" element={<ElderCareMonitor />} />
          <Route path="/vaccination-tracker" element={<VaccinationTracker />} />
          <Route path="/predictive-health" element={<PredictiveHealthAI />} />
          <Route path="/gesture-control" element={<EmergencyGestureControl />} />
          <Route path="/medication-schedule" element={<MedicationSchedule />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
