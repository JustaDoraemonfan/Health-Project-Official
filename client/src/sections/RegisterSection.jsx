// client/src/sections/RegisterSection.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  AlertCircle,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const RegisterSection = ({ onToggleAuth }) => {
  const [formData, setFormData] = useState({
    userType: "patient",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "other",
    specialization: "",
    phone: "",
    location: "",
    department: "",
    adminRole: "verifier",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const { register, loading, error, clearError, isAuthenticated } = useAuth();

  const userTypes = [
    { value: "patient", label: "Patient" },
    { value: "doctor", label: "Doctor" },
    { value: "frontlineWorker", label: "Frontline Worker" },
    { value: "admin", label: "Admin" },
  ];

  const adminRoles = [
    { value: "verifier", label: "Verifier" },
    { value: "support", label: "Support" },
  ];

  // Clear errors when form data changes

  // Check form validity
  useEffect(() => {
    const checkFormValidity = () => {
      // Check required basic fields
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        return false;
      }

      // Check passwords match
      if (formData.password !== formData.confirmPassword) {
        return false;
      }

      // Check role-specific required fields
      if (formData.userType === "doctor" && !formData.specialization.trim()) {
        return false;
      }

      if (formData.userType === "frontlineWorker") {
        if (!formData.phone.trim() || !formData.location.trim()) {
          return false;
        }
      }

      if (formData.userType === "admin") {
        if (!formData.department.trim() || !formData.adminRole.trim()) {
          return false;
        }
      }

      // Check if there are any validation errors
      if (Object.keys(validationErrors).length > 0) {
        return false;
      }

      return true;
    };

    setIsFormValid(checkFormValidity());
  }, [formData, validationErrors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors };

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          errors.name = "Full name is required";
        } else if (value.trim().length < 2) {
          errors.name = "Name must be at least 2 characters";
        } else {
          delete errors.name;
        }
        break;

      case "email":
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;

      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else if (value.length < 8) {
          errors.password = "Password must be at least 8 characters";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = "Must contain uppercase, lowercase, and number";
        } else {
          delete errors.password;
        }

        // Also validate confirm password if it's been touched
        if (touched.confirmPassword && formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
          } else {
            delete errors.confirmPassword;
          }
        }
        break;

      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          delete errors.confirmPassword;
        }
        break;

      case "specialization":
        if (formData.userType === "doctor" && !value.trim()) {
          errors.specialization = "Specialization is required for doctors";
        } else {
          delete errors.specialization;
        }
        break;

      case "phone":
        if (formData.userType === "frontlineWorker" && !value.trim()) {
          errors.phone = "Phone number is required";
        } else if (value && !/^\+?[\d\s-()]+$/.test(value)) {
          errors.phone = "Please enter a valid phone number";
        } else {
          delete errors.phone;
        }
        break;

      case "location":
        if (formData.userType === "frontlineWorker" && !value.trim()) {
          errors.location = "Location is required";
        } else {
          delete errors.location;
        }
        break;

      case "department":
        if (formData.userType === "admin" && !value.trim()) {
          errors.department = "Department is required";
        } else {
          delete errors.department;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "Must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Role-specific validation
    if (formData.userType === "frontlineWorker") {
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        errors.phone = "Please enter a valid phone number";
      }
      if (!formData.location.trim()) {
        errors.location = "Location is required";
      }
    }

    if (formData.userType === "doctor" && !formData.specialization.trim()) {
      errors.specialization = "Specialization is required";
    }

    if (formData.userType === "admin") {
      if (!formData.department.trim()) {
        errors.department = "Department is required";
      }
      if (!formData.adminRole.trim()) {
        errors.adminRole = "Admin role is required";
      }
    }

    return errors;
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    const touchedFields = {};
    allFields.forEach((field) => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
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
    } else if (formData.userType === "admin") {
      registerData.department = formData.department.trim();
      registerData.adminRole = formData.adminRole;
    }

    const result = await register(registerData);

    if (result.success) {
      setSuccess(true);
      console.log("Registration successful:", result.data);

      setTimeout(() => {
        alert(
          `Welcome ${result.data.name}! Your account has been created successfully. Redirecting to your dashboard...`
        );
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
    <section id="register" className="py-20 bg-[var(--color-primary)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl google-sans-code-400 font-bold text-[var(--color-secondary)] mb-4">
            Create Your <span className="text-blue-400">HealthyMe</span> Account
          </h2>
          <p className="text-slate-500 google-sans-code-400">
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

          {/* Backend Error Display */}
          {error && showError && !success && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/10 rounded-lg">
              <div className="flex items-start gap-2 text-red-500 text-sm google-sans-code-400">
                <AlertCircle className="w-4 h-4 mt-0.5 text-red-800 flex-shrink-0" />
                <div>{error}</div>
              </div>
            </div>
          )}
          <form onSubmit={handleRegister}>
            <div className="bg-[var(--color-secondary)] border border-gray-700 rounded-lg overflow-hidden">
              {/* Form Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-primary)] border-b border-gray-700">
                <div className="text-black text-sm google-sans-code-400">
                  Registration Form
                </div>
                <div className="w-12"></div>
              </div>

              <div className="p-6 space-y-6 google-sans-code-400">
                {/* User Type Selection */}
                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Select User Type <span className="text-red-500">*</span>
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

                {/* Full Name */}
                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("name")}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                      touched.name && validationErrors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                  {touched.name && validationErrors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("email")}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                      touched.email && validationErrors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                  {touched.email && validationErrors.email && (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("password")}
                      disabled={loading}
                      className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                        touched.password && validationErrors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {touched.password && validationErrors.password && (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.password}
                    </p>
                  )}
                  {!validationErrors.password && (
                    <div className="text-xs text-gray-400 mt-1">
                      At least 8 characters with uppercase, lowercase, and
                      number
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-slate-50 text-sm mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      disabled={loading}
                      className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                        touched.confirmPassword &&
                        validationErrors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Re-enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword &&
                    validationErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-400">
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                </div>

                {/* Role-specific fields - Patient */}
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
                        placeholder="Age (optional)"
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

                {/* Role-specific fields - Doctor */}
                {formData.userType === "doctor" && (
                  <div>
                    <label className="block text-slate-50 text-sm mb-2">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("specialization")}
                      disabled={loading}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                        touched.specialization &&
                        validationErrors.specialization
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="e.g., Cardiology, Pediatrics"
                      required
                    />
                    {touched.specialization &&
                      validationErrors.specialization && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.specialization}
                        </p>
                      )}
                  </div>
                )}

                {/* Role-specific fields - Frontline Worker */}
                {formData.userType === "frontlineWorker" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("phone")}
                        disabled={loading}
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                          touched.phone && validationErrors.phone
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        placeholder="Enter your phone number"
                        required
                      />
                      {touched.phone && validationErrors.phone && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("location")}
                        disabled={loading}
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                          touched.location && validationErrors.location
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        placeholder="Enter your location"
                        required
                      />
                      {touched.location && validationErrors.location && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.location}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Role-specific fields - Admin */}
                {formData.userType === "admin" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("department")}
                        disabled={loading}
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50 ${
                          touched.department && validationErrors.department
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        placeholder="Enter department"
                        required
                      />
                      {touched.department && validationErrors.department && (
                        <p className="mt-1 text-xs text-red-400">
                          {validationErrors.department}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-50 text-sm mb-2">
                        Admin Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="adminRole"
                        value={formData.adminRole}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white google-sans-code-400 text-sm transition-all duration-200 disabled:opacity-50"
                      >
                        {adminRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success || !isFormValid}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white google-sans-code-400 rounded-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none hover:cursor-pointer disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-purple-600"
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

                {!isFormValid && !loading && !success && (
                  <div className="text-gray-400 text-xs text-center -mt-2">
                    Please fill in all required fields to continue
                  </div>
                )}

                <div className="text-gray-500 text-sm text-center">
                  Your account will be securely created with the latest security
                  standards.
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onToggleAuth}
              className="text-blue-500 hover:text-blue-300 google-sans-code-400 text-sm transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
