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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });
  const [showError, setShowError] = useState(false);

  const { login, loading, error, clearError, isAuthenticated } = useAuth();

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
      expectedRole: formData.role, // Optional: to verify role matches
    });

    if (result.success) {
      // Redirect based on user role
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
  if (isAuthenticated) {
    return (
      <section id="login" className="py-20 bg-[#161515]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-mono font-bold text-gray-100 mb-4">
            You're already logged in!
          </h2>
          <p className="text-slate-50 font-mono">
            Welcome back to <span className="text-blue-400">HealthyMe</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="login" className="py-20 bg-[#161515]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-mono font-bold text-gray-100 mb-4">
            Login to <span className="text-blue-400">HealthyMe</span>
          </h2>
          <p className="text-slate-50 font-mono">
            Select your role to continue
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Error Display */}
          {(error || showError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>{error || "Please fill in all required fields"}</span>
              </div>
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg p-1">
              <div className="grid grid-cols-2 gap-1">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-mono transition-all duration-200 disabled:opacity-50 ${
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

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg overflow-hidden">
              {/* Form Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-gray-700">
                <div className="text-black text-sm font-mono">
                  {userTypes.find((t) => t.id === activeTab)?.label} Login
                </div>
                <div className="w-12"></div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6 font-mono">
                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 font-mono text-sm transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 font-mono text-sm transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.email.trim() ||
                    !formData.password.trim()
                  }
                  className={`w-full py-3 px-4 bg-gradient-to-r ${getColorClasses(
                    userTypes.find((t) => t.id === activeTab)?.color
                  )} text-white font-mono rounded-md hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:hover:opacity-50`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 inline mr-2" />
                      Login as{" "}
                      {userTypes.find((t) => t.id === activeTab)?.label}
                    </>
                  )}
                </button>

                <div className="text-gray-500 text-sm">
                  Secure login. Please enter your details.
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#register"
              className="text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors duration-200"
            >
              Don't have an account? Register here
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
