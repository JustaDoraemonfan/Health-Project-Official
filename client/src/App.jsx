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
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

// Component to handle routing logic
const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
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
