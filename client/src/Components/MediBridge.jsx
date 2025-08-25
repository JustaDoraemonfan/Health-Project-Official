import React, { useState, useEffect } from "react";
import RoleCard from "./cards/RoleCard";
import AuthForm from "./forms/AuthForm";
import Header from "./layout/Header";
import { roles } from "../data/roles";
import { validateForm } from "../utils/validation";
import PatientDashboard from "./RoleDashboards/patientDashboard";
import DoctorDashBoard from "./RoleDashboards/doctorDashBoard";
import FWLDashboard from "./RoleDashboards/fwlDashboard";
import AdminDashborad from "./RoleDashboards/adminDashborad";

// Simple API imports
import {
  loginUser,
  registerUser,
  logoutUser,
  isLoggedIn,
  getCurrentUser,
} from "../utils/api";
import StatsSection from "./layout/Stats";

const MediBridge = () => {
  const [currentView, setCurrentView] = useState("roleSelection");
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    specialization: "",
    phone: "",
    location: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      const currentUser = getCurrentUser();
      console.log("Found existing user:", currentUser);
      if (currentUser && currentUser.name) {
        setUser(currentUser);
        setCurrentView("dashboard");
      }
    }
  }, []);

  useEffect(() => {
    if (currentView === "roleSelection") {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setCurrentView("login");
    setIsLogin(true);
    setErrors([]);
    setSuccessMessage("");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: "",
      gender: "",
      specialization: "",
      phone: "",
      location: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear errors and success message when user types
    if (errors.length > 0) {
      setErrors([]);
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    console.log("=== AUTHENTICATION ATTEMPT ===");
    console.log("Form data:", formData);
    console.log("Selected role:", selectedRole);
    console.log("Is login:", isLogin);

    // Reset states at the beginning
    setErrors([]);
    setSuccessMessage("");

    // Validate form
    const validationErrors = validateForm(formData, selectedRole, isLogin);
    console.log("Validation errors:", validationErrors);

    if (validationErrors && validationErrors.length > 0) {
      console.log("Form validation failed");
      setErrors(validationErrors);
      return;
    }

    console.log("Form validation passed, starting API call...");
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        console.log("Attempting login...");
        result = await loginUser(formData.email, formData.password);
      } else {
        console.log("Attempting registration...");
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        };

        // Add role-specific fields
        if (selectedRole === "patient") {
          userData.age = formData.age;
          userData.gender = formData.gender;
        } else if (selectedRole === "doctor") {
          userData.specialization = formData.specialization;
        } else if (selectedRole === "frontlineWorker") {
          userData.phone = formData.phone;
          userData.location = formData.location;
        }

        console.log("Registration data:", userData);
        result = await registerUser(userData);
      }

      console.log("API result:", result);

      if (result && result.success && result.user) {
        console.log("✅ Authentication successful!");
        console.log("User data:", result.user);

        // Clear any existing errors
        setErrors([]);

        // Set user and success message
        setUser(result.user);
        setSuccessMessage(
          `${isLogin ? "Login" : "Registration"} successful! Welcome ${
            result.user.name
          }!`
        );

        console.log("Success message set, clearing form...");
        resetForm();

        // Redirect after a short delay
        console.log("Setting redirect timeout...");
        setTimeout(() => {
          console.log("🚀 Redirecting to dashboard...");
          setCurrentView("dashboard");
          setSuccessMessage("");
        }, 1500);
      } else {
        console.log("❌ Authentication failed:", result);
        const errorMessage =
          result?.message || "Authentication failed. Please try again.";
        console.log("Setting error message:", errorMessage);
        setErrors([errorMessage]);
        setSuccessMessage(""); // Explicitly clear success message
      }
    } catch (error) {
      console.error("❌ Auth error caught:", error);
      const errorMessage =
        error?.message || "Something went wrong. Please try again.";
      console.log("Setting error message:", errorMessage);
      setErrors([errorMessage]);
      setSuccessMessage(""); // Explicitly clear success message
    } finally {
      setLoading(false);
      console.log("=== AUTHENTICATION COMPLETE ===");
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors([]);
    setSuccessMessage("");
    resetForm();
  };

  const goBackToRoles = () => {
    setCurrentView("roleSelection");
    setErrors([]);
    setSuccessMessage("");
    resetForm();
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView("roleSelection");
    setErrors([]);
    setSuccessMessage("");
    resetForm();
  };

  // Debug current state
  console.log("Current state:", {
    currentView,
    user: user ? { name: user.name, role: user.role } : null,
    errors,
    successMessage,
    loading,
  });

  // If user is logged in, show dashboard
  if (user && currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-[#292929]">
        <Header onLogoClick={() => setCurrentView("roleSelection")} />

        <main className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Welcome, {user.name}!
              </h1>
              <p className="text-lg text-slate-600">
                <span className="capitalize">{user.role}</span> Dashboard
              </p>
            </div>

            {/* Role-specific dashboard content */}
            <div className="grid gap-6">
              {user.role === "patient" && <PatientDashboard />}

              {user.role === "doctor" && <DoctorDashBoard />}

              {user.role === "frontlineWorker" && <FWLDashboard />}

              {user.role === "admin" && <PatientDashboard />}

              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Account Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-600">{user.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">{user.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="ml-2 text-gray-600 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">User ID:</span>
                    <span className="ml-2 text-gray-600 font-mono text-sm">
                      {user._id}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setCurrentView("roleSelection")}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Switch Role
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Role Selection View
  if (currentView === "roleSelection") {
    return (
      <div className="min-h-screen bg-[#1c1c1c]">
        <Header onLogoClick={() => setCurrentView("roleSelection")} />
        <StatsSection
          patients={1021}
          doctors={345}
          hospitals={45}
          treatments={1158}
        />
        <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent mb-6 leading-tight">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  Healthcare Role
                </span>
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Access personalized healthcare tools and features designed
                specifically for your professional needs and patient care
                requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {roles.map((role, index) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onRoleSelect={handleRoleSelect}
                  isAnimating={isAnimating}
                  index={index}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Auth Form View
  if (currentView === "login") {
    return (
      <AuthForm
        selectedRole={selectedRole}
        roles={roles}
        isLogin={isLogin}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAuth={handleAuth}
        toggleAuthMode={toggleAuthMode}
        goBackToRoles={goBackToRoles}
        errors={errors}
        successMessage={successMessage}
        loading={loading}
      />
    );
  }
};

export default MediBridge;
