// client/src/sections/LoginSection.jsx
import React, { useState, useEffect } from "react";
import {
  Activity,
  Shield,
  User,
  Lock,
  Settings,
  AlertCircle,
  Loader2,
  Eye, // Added
  EyeOff, // Added
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export const LoginSection = ({ onToggleAuth }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added state for password toggle

  const { login, loading, error, clearError, isAuthenticated, user } =
    useAuth();

  const userTypes = [
    {
      id: "patient",
      label: "Patient",
      icon: <User className="w-4 h-4" />,
      color: "blue",
    },
    {
      id: "doctor",
      label: "Doctor",
      icon: <Activity className="w-4 h-4" />,
      color: "green",
    },
    {
      id: "frontlineWorker",
      label: "Frontline Worker",
      icon: <Shield className="w-4 h-4" />,
      color: "purple",
    },
    {
      id: "admin",
      label: "Hospital Admin",
      icon: <Settings className="w-4 h-4" />,
      color: "red",
    },
  ];

  // Update form data when active tab changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: activeTab }));
  }, [activeTab]);

  // Clear error when form data changes
  useEffect(() => {
    if (error && showError) {
      clearError();
      setShowError(false);
    }
  }, [formData.email, formData.password, clearError, error, showError]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setShowError(true);
      return;
    }

    const result = await login({
      email: formData.email.trim(),
      password: formData.password,
      expectedRole: formData.role,
    });

    if (result.success) {
      const userRole = result.data.data.role;
      console.log(`Login successful for ${userRole}:`, result.data.data);
      navigate(`/${userRole}/dashboard`);
    } else {
      setShowError(true);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 border-blue-500",
      green: "from-green-500 to-green-600 border-green-500",
      purple: "from-purple-500 to-purple-600 border-purple-500",
      red: "from-red-500 to-red-600 border-red-500",
    };
    return colors[color];
  };

  // Don't show login if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <section className="py-20 bg-[var(--color-primary)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl spline-sans-mono-400 font-bold text-[var(--color-secondary)] mb-4">
            Login to <span className="text-blue-400">HealthyMe</span>
          </h2>
          <p className="text-[var(--color-secondary)] spline-sans-mono-400">
            Select your role to continue
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Error Display */}
          {(error || showError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm spline-sans-mono-400">
                <AlertCircle className="w-4 h-4" />
                <span>{error || "Please fill in all required fields"}</span>
              </div>
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-8">
            <div className="bg-[var(--color-secondary)] rounded-lg p-1">
              <div className="grid grid-cols-2 gap-1">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm spline-sans-mono-400 transition-all duration-200 disabled:opacity-50 ${
                      activeTab === type.id
                        ? `bg-gradient-to-r ${
                            getColorClasses(type.color).split(" ")[0]
                          } ${
                            getColorClasses(type.color).split(" ")[1]
                          } text-white`
                        : "text-slate-50 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {type.icon}
                    <span className="hidden sm:inline">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Login Form */}
          <form onSubmit={handleLogin}>
            <div className="bg-[var(--color-secondary)] rounded-lg border border-slate-600 shadow-xl">
              {/* Header */}
              <div className="px-6 py-4 bg-slate-100 border-b border-black">
                <h2 className="text-slate-900 text-sm spline-sans-mono-400 font-semibold">
                  {userTypes.find((t) => t.id === activeTab)?.label}{" "}
                  Authentication
                </h2>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-slate-200 text-sm spline-sans-mono-400 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white placeholder-slate-400 spline-sans-mono-400 text-sm transition-colors disabled:opacity-50"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* --- MODIFIED PASSWORD FIELD --- */}
                <div>
                  <label className="block text-slate-200 text-sm spline-sans-mono-400 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} // Dynamic type
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 text-white placeholder-slate-400 spline-sans-mono-400 text-sm transition-colors disabled:opacity-50" // Added pr-10
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button" // Prevent form submission
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {/* --- END OF MODIFICATION --- */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.email.trim() ||
                    !formData.password.trim()
                  }
                  className={`w-full py-3 px-4 bg-gradient-to-r ${getColorClasses(
                    userTypes.find((t) => t.id === activeTab)?.color,
                  )} text-white spline-sans-mono-400 font-medium rounded-md hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Sign In
                    </span>
                  )}
                </button>

                <p className="text-slate-400 text-xs spline-sans-mono-400 text-center">
                  Secure authentication required
                </p>
              </div>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={onToggleAuth}
              className="text-blue-500 hover:text-blue-300 spline-sans-mono-400 text-sm transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Don't have an account? Register here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
