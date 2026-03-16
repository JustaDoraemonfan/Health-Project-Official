import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./sections/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
// Global error boundary — catches any render error in the entire tree.
// Without this, a single component crash produces a blank white screen.
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(
      "[GlobalErrorBoundary] Uncaught error:",
      error,
      info.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-8 bg-gray-50">
          <AlertCircle className="w-16 h-16 text-red-400" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              An unexpected error occurred. Your data is safe — refreshing the
              page should fix this.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import PatientDashboard from "./Pages/Dashboards/PatientDashboard";
import DoctorDashboard from "./Pages/Dashboards/DoctorDashboard";
import AdminDashboard from "./Pages/Dashboards/AdminDashboard";

import FWLDashboard from "./Pages/Dashboards/FWLDashboard";

import BookConsultation from "./patientConfig/DashboardUtils/BookConsultation";
import UpdateProfile from "./patientConfig/DashboardUtils/UpdateProfile";
import AppointmentDashboard from "./patientConfig/DashboardUtils/Appointment";
import "./App.css";
import DoctorAppointment from "./DoctorConfig/DashboardUtils/DoctorAppointment";
import EmergencyMap from "./Pages/EmergencyMap";
import PrescriptionUploadModal from "./DoctorConfig/Prescription/Prescription";
import { PatientPrescriptionDashboard } from "./patientConfig/Prescription/PatientPrescriptionDashboard";
import HealthRecordsDashboard from "./patientConfig/DashboardUtils/HealthRecordsDashboard";
import MedicationDashboard from "./patientConfig/MedicationReminder/MedicationDashboard";
import DoctorSymptomPage from "./DoctorConfig/DashboardUtils/DoctorSymptomPage";
import DoctorSlotSelection from "./DoctorConfig/DoctorSlots/DoctorSlotSelection";
import DoctorCalendar from "./DoctorConfig/Calendar/DoctorCalendar";
import DoctorVerificationDashboard from "./AdminConfig/DoctorVerification/DoctorVerification";
import CreateAdmin from "./AdminConfig/CreateAdmin/CreateAdmin";
import PatientManagement from "./DoctorConfig/DashboardUtils/PatientManagement";
import HealthyAI from "./ChatBot/HealthyAI";
import DoctorNotes from "./DoctorConfig/DoctorNotes/DoctorNotes";

const AppRoutes = () => {
  const { isAuthenticated, user, initialized, error } = useAuth();

  if (!initialized) {
    return (
      <LoadingSpinner message="Wait patiently while we load your info ..." />
    );
  }

  if (error && !isAuthenticated) {
    console.log("Auth error occurred:", error.message);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate
              to={
                user.role === "patient"
                  ? "/patient/dashboard"
                  : user.role === "doctor"
                    ? "/doctor/dashboard"
                    : user.role === "fwl"
                      ? "/fwl/dashboard"
                      : "/admin/dashboard"
              }
              replace
            />
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Patient Dashboard - Only patients can access */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Doctor Dashboard - Only doctors can access */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* FWL Dashboard - Only FWL users can access */}
      <Route
        path="/fwl/dashboard"
        element={
          <ProtectedRoute allowedRoles={["fwl"]}>
            <FWLDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard - Only admins can access */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Book Consultation - Patients and potentially FWL users */}
      <Route
        path="/book-consultant"
        element={
          <ProtectedRoute allowedRoles={["patient", "fwl"]}>
            <BookConsultation />
          </ProtectedRoute>
        }
      />

      {/* Update Profile - All authenticated users */}
      <Route
        path="/update-profile"
        element={
          <ProtectedRoute allowedRoles={["patient", "doctor", "fwl", "admin"]}>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />

      {/* Emergency Page - Accessible to all authenticated users */}
      {
        <Route
          path="/emergency"
          element={
            <ProtectedRoute
              allowedRoles={["patient", "doctor", "fwl", "admin"]}
            >
              <EmergencyMap />
            </ProtectedRoute>
          }
        />
      }

      {/* Patient Appointments - Only patients */}
      <Route
        path="/patient/appointment"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <AppointmentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/health"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <HealthRecordsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/medication"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MedicationDashboard />
          </ProtectedRoute>
        }
      />

      {/* Doctor Appointments - Only doctors */}
      <Route
        path="/doctor/appointment"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <PrescriptionUploadModal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/slots"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorSlotSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/calendar"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/symptoms"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorSymptomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patient-management"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <PatientManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/prescription"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientPrescriptionDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctor-verification"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DoctorVerificationDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute allowedRoles={["patient", "fwl", "admin"]}>
            <HealthyAI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/messages"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorNotes />
          </ProtectedRoute>
        }
      />
      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <GlobalErrorBoundary>
      <Router>
        <div className="App">
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </div>
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;
