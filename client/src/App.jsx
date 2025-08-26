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
  PatietntDashboard,
  DoctorDashboard,
  FWLDashboard,
  AdminDashboard,
} from "./pages/Dahsboards/Dashboard";
import "./App.css";

// Component to handle routing logic
const AppRoutes = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    <LoadingSpinner />;
  }
  return (
    <Routes>
      {/* Public route - Landing page with login/register */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user.role}/dashboard`} replace />
          ) : (
            <LandingPage />
          )
        }
      />
      {/* Dashboards */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatietntDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/frontlineWorker/dashboard"
        element={
          <ProtectedRoute allowedRoles={["frontlineWorker"]}>
            <FWLDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
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
    <div style={{ minHeight: "100vh" }}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
