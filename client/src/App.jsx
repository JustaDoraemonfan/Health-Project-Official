// client/src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  PatientDashboard,
  DoctorDashboard,
  FWLDashboard,
  AdminDashboard,
} from "./pages/Dahsboards/Dashboard";
import BookConsultation from "./pages/Dahsboards/BookConsultation";
import UpdateProfile from "./pages/Dahsboards/Components/UpdateProfile";
import AppointmentDashboard from "./pages/Dahsboards/Appointment";
import "./App.css";

// Component to handle routing logic
const AppRoutes = () => {
  const { isAuthenticated, user, initialized, error } = useAuth();

  // Show spinner only during initial load, not during all loading states
  if (!initialized) {
    return <LoadingSpinner />;
  }

  // If there's an auth error and we're not authenticated,
  // we might want to handle this gracefully
  if (error && !isAuthenticated) {
    console.log("Auth error occurred:", error);
    // You could show an error page or just proceed to landing
  }

  return (
    <Routes>
      {/* Public route - Landing page with login/register */}
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

      {/* Dashboards */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fwl/dashboard"
        element={
          <ProtectedRoute>
            <FWLDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-consultant"
        element={
          <ProtectedRoute>
            <BookConsultation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-profile"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment"
        element={
          <ProtectedRoute>
            <AppointmentDashboard />
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
