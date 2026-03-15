import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { adminAPI, dashboardAPI } from "../../services/api";
import Header from "../../components/Header";

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [isSuperadmin, setIsSuperadmin] = useState(null); // null = loading
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [checkError, setCheckError] = useState(null); // network/server error during role check
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [createdAdmin, setCreatedAdmin] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminRole: "verifier",
    department: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // On mount — check if the logged-in admin is a superadmin
  // Distinguishes between real access denial (401/403) and network/server errors
  const checkRole = async () => {
    setCheckingRole(true);
    setCheckError(null);
    try {
      const res = await dashboardAPI.getAdminDashboard();
      const adminId = res.data.data.admin.id;
      const adminRes = await adminAPI.getAdmin(adminId);
      const adminRole = adminRes.data.data.role;
      setIsSuperadmin(adminRole === "superadmin");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        // Real access denial — token invalid or role insufficient
        setIsSuperadmin(false);
      } else {
        // Network error, server cold-starting, timeout etc.
        // Don't falsely show Access Denied — show a retry option instead
        setCheckError(
          "Could not verify your permissions. Check your connection and try again.",
        );
      }
    } finally {
      setCheckingRole(false);
    }
  };

  useEffect(() => {
    checkRole();
  }, []);

  const validate = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = "Full name is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = "Enter a valid email address";
    if (!data.password) errors.password = "Password is required";
    else if (data.password.length < 8)
      errors.password = "At least 8 characters required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password))
      errors.password = "Must include uppercase, lowercase and a number";
    if (!data.department.trim()) errors.department = "Department is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errors = validate(formData);
    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.createAdmin({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        adminRole: formData.adminRole,
        department: formData.department.trim(),
      });
      setCreatedAdmin(res.data.data);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create admin. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-1 text-white placeholder-gray-500 text-sm transition-all duration-200 disabled:opacity-50 ${
      touched[field] && validationErrors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
    }`;

  // ── Loading role check ──
  if (checkingRole) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center pt-20">
          <div className="text-white text-lg">Checking permissions...</div>
        </div>
      </>
    );
  }

  // ── Network/server error during role check — show retry, not Access Denied ──
  if (checkError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center pt-20">
          <div className="text-center max-w-md px-6">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-8">{checkError}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={checkRole}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Access Denied — confirmed not a superadmin (401/403) ──
  if (!isSuperadmin) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center pt-20">
          <div className="text-center max-w-md px-6">
            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Access Denied
            </h2>
            <p className="text-gray-400 mb-6">
              Only superadmins can create new admin accounts. Your current role
              does not have this permission.
            </p>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Success screen ──
  if (success && createdAdmin) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center pt-20">
          <div className="max-w-md w-full mx-auto px-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Admin Created!
            </h2>
            <p className="text-gray-400 mb-8">
              The new admin account has been created successfully.
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-left mb-8 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Name</span>
                <span className="text-white font-medium">
                  {createdAdmin.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium">
                  {createdAdmin.email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Role</span>
                <span className="text-blue-400 font-medium capitalize">
                  {createdAdmin.adminRole}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Department</span>
                <span className="text-white font-medium">
                  {createdAdmin.department}
                </span>
              </div>
            </div>
            <p className="text-yellow-400 text-sm mb-8">
              Make sure to share the login credentials with the new admin
              securely. The password cannot be retrieved after this screen.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setCreatedAdmin(null);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    adminRole: "verifier",
                    department: "",
                  });
                  setTouched({});
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                Create Another
              </button>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main form ──
  return (
    <>
      <Header />
      <section className="min-h-screen bg-[var(--color-primary)] py-8 pt-24">
        <div className="container mx-auto px-6 max-w-lg">
          {/* Back button */}
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="text-center mb-10">
            <UserPlus className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Admin Account
            </h2>
            <p className="text-gray-400 text-sm">
              Superadmin only — new admins will log in using the credentials you
              set here.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <div className="px-5 py-4 bg-gray-800 border-b border-gray-700">
                <span className="text-white text-sm font-medium">
                  New Admin Details
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    disabled={loading}
                    placeholder="Enter full name"
                    className={inputClass("name")}
                  />
                  {touched.name && validationErrors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    disabled={loading}
                    placeholder="Enter email address"
                    className={inputClass("email")}
                  />
                  {touched.email && validationErrors.email && (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      disabled={loading}
                      placeholder="Set a strong password"
                      className={inputClass("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {touched.password && validationErrors.password ? (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.password}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Min 8 characters with uppercase, lowercase and number
                    </p>
                  )}
                </div>

                {/* Admin Role */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Admin Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="adminRole"
                    value={formData.adminRole}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm disabled:opacity-50"
                  >
                    <option value="verifier">
                      Verifier — can approve/reject doctors
                    </option>
                    <option value="support">
                      Support — can view analytics only
                    </option>
                    <option value="superadmin">Superadmin — full access</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Choose carefully — this sets what the new admin can do.
                  </p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onBlur={() => handleBlur("department")}
                    disabled={loading}
                    placeholder="e.g. Verification, Support, Operations"
                    className={inputClass("department")}
                  />
                  {touched.department && validationErrors.department && (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.department}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Admin Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateAdmin;
