// client/src/sections/RegisterSection.jsx
import React, { useState, useEffect } from "react";
import { User, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const RegisterSection = () => {
  const [formData, setFormData] = useState({
    userType: "patient",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Additional fields based on user type
    age: "",
    gender: "other",
    specialization: "",
    phone: "",
    location: "",
  });
  const [showError, setShowError] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const { register, loading, error, clearError, isAuthenticated } = useAuth();

  const userTypes = [
    { value: "patient", label: "Patient" },
    { value: "doctor", label: "Doctor" },
    { value: "frontlineWorker", label: "Frontline Worker" },
    { value: "admin", label: "Hospital Admin" },
  ];

  // Clear errors when form data changes
  useEffect(() => {
    if (error && showError) {
      clearError();
      setShowError(false);
    }
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [formData, clearError, error, showError, validationErrors.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Client-side validation
  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Full name is required");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.password) {
      errors.push("Password is required");
    } else if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.push(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    // Additional validation based on user type
    if (formData.userType === "frontlineWorker") {
      if (!formData.phone.trim()) {
        errors.push("Phone number is required for frontline workers");
      }
      if (!formData.location.trim()) {
        errors.push("Location is required for frontline workers");
      }
    }

    if (formData.userType === "doctor" && !formData.specialization.trim()) {
      errors.push("Specialization is required for doctors");
    }

    return errors;
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Client-side validation
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowError(true);
      return;
    }

    // Prepare data for backend
    const registerData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.userType,
    };

    // Add role-specific fields
    if (formData.userType === "patient") {
      if (formData.age) registerData.age = parseInt(formData.age);
      if (formData.gender) registerData.gender = formData.gender;
    } else if (formData.userType === "doctor") {
      registerData.specialization = formData.specialization.trim();
    } else if (formData.userType === "frontlineWorker") {
      registerData.phone = formData.phone.trim();
      registerData.location = formData.location.trim();
    }

    const result = await register(registerData);

    if (result.success) {
      setSuccess(true);
      console.log("Registration successful:", result.data);

      // Show success message and redirect after delay
      setTimeout(() => {
        alert(
          `Welcome ${result.data.name}! Your account has been created successfully. Redirecting to your dashboard...`
        );
        // You can implement navigation here
        // For example: navigate(`/${result.data.role}/dashboard`);
      }, 1500);
    } else {
      setShowError(true);
    }
  };

  // Don't show register form if already authenticated
  if (isAuthenticated) {
    return (
      <section id="register" className="py-20 bg-zinc-700/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl google-sans-code-400 font-bold text-gray-100 mb-4">
            You're already registered!
          </h2>
          <p className="text-slate-50 google-sans-code-400">
            Welcome to <span className="text-blue-400">HealthyMe</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-20 bg-[#27272A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl google-sans-code-400 font-bold text-gray-100 mb-4">
            Create Your <span className="text-blue-400">HealthyMe</span> Account
          </h2>
          <p className="text-slate-50 google-sans-code-400">
            Fill in your details to get started
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 text-sm google-sans-code-400">
                <CheckCircle className="w-4 h-4" />
                <span>Account created successfully! Welcome to HealthyMe!</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {(error || showError) && !success && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-2 text-red-400 text-sm google-sans-code-400">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  {error && <div className="mb-1">{error}</div>}
                  {validationErrors.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 border border-gray-700 rounded-lg overflow-hidden">
              {/* Form Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-gray-700">
                <div className="text-black text-sm google-sans-code-400">
                  Registration Form
                </div>
                <div className="w-12"></div>
              </div>

              <div className="p-6 space-y-6 google-sans-code-400">
                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Select User Type *
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-slate-500 focus:ring-1 focus:ring-blue-500 text-white google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                  >
                    {userTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and
                    number
                  </div>
                </div>

                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                    placeholder="Re-enter your password"
                    required
                  />
                </div>

                {/* Role-specific fields */}
                {formData.userType === "patient" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={loading}
                        min="1"
                        max="120"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}

                {formData.userType === "doctor" && (
                  <div>
                    <label className="block text-slate-50 text-sm mb-2">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                      placeholder="e.g., Cardiology, Pediatrics"
                      required
                    />
                  </div>
                )}

                {formData.userType === "frontlineWorker" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                        placeholder="Enter your location"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white google-sans-code-400 rounded-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:hover:from-purple-500 disabled:hover:to-purple-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Account Created!
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 inline mr-2" />
                      Create Account
                    </>
                  )}
                </button>

                <div className="text-gray-500 text-sm">
                  Your account will be securely created with the latest security
                  standards.
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#login"
              className="text-blue-400 hover:text-blue-300 google-sans-code-400 text-sm transition-colors duration-200"
            >
              Already have an account? Login here
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
