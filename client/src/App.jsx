// client/src/App.js
import React from "react";
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
import {
  PatientDashboard,
  DoctorDashboard,
  FWLDashboard,
  AdminDashboard,
} from "./pages/Dahsboards/Dashboard";
import BookConsultation from "./patientConfig/DashboardUtils/BookConsultation";
import UpdateProfile from "./patientConfig/DashboardUtils/UpdateProfile";
import AppointmentDashboard from "./patientConfig/DashboardUtils/Appointment";
import "./App.css";
import DoctorAppointment from "./DoctorConfig/DashboardUtils/DoctorAppointment";
import EmergencyMap from "./pages/EmergencyMap";
import PrescriptionUploadModal from "./DoctorConfig/Prescription/Prescription";
import { PatientPrescriptionDashboard } from "./patientConfig/Prescription/PatientPrescriptionDashboard";
import HealthRecordsDashboard from "./patientConfig/DashboardUtils/HealthRecordsDashboard";
import MedicationDashboard from "./patientConfig/MedicationReminder/MedicationDashboard";
import DoctorSymptomPage from "./DoctorConfig/DashboardUtils/DoctorSymptomPage";
import DoctorSlotSelection from "./DoctorConfig/DoctorSlots/DoctorSlotSelection";
import DoctorCalendar from "./DoctorConfig/Calendar/DoctorCalendar";

const AppRoutes = () => {
  const { isAuthenticated, user, initialized, error } = useAuth();

  if (!initialized) {
    return <LoadingSpinner />;
  }

  if (error && !isAuthenticated) {
    console.log("Auth error occurred:", error);
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
        path="/patient/prescription"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientPrescriptionDashboard />
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
    <Router>
      <div className="App">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
