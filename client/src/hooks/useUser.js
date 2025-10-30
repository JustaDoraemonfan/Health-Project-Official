// hooks/useUser.js
import { useState, useCallback, useEffect } from "react";
import { authAPI } from "../services/api";

export const useUser = () => {
  // === STATE ===

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // === HELPER ===
  const clearError = () => setError(null);

  /**
   * Fetches the current authenticated user with full profile data
   */
  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.getCurrentUser();
      const userData = response.data.data || response.data;
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to fetch user data";
      setError(errorMsg);
      setUser(null);
      setIsAuthenticated(false);

      if (err.response?.status === 401) {
        setIsAuthenticated(false);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refreshes the current user data
   */
  const refreshUser = useCallback(async () => {
    return getCurrentUser();
  }, [getCurrentUser]);

  /**
   * Clears the user state (useful for logout)
   */
  const clearUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Updates user state locally (useful after profile updates)
   */
  const updateUserLocally = useCallback((updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
  }, []);

  // Derived state helpers for easier access
  const userRole = user?.role;
  const isDoctor = userRole === "doctor";
  const isPatient = userRole === "patient";
  const isAdmin = ["admin", "superadmin", "verifier", "support"].includes(
    userRole
  );

  // Role-specific profiles
  const doctorProfile = user?.doctorProfile;
  const patientProfile = user?.patientProfile;
  const adminProfile = user?.adminProfile;

  // Auto-fetch current user on mount
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      getCurrentUser().catch(() => {
        console.log("User not authenticated");
      });
    }
  }, [getCurrentUser]);

  // === RETURN VALUE ===
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Role helpers
    userRole,
    isDoctor,
    isPatient,
    isAdmin,

    // Profile data
    doctorProfile,
    patientProfile,
    adminProfile,

    // Actions
    getCurrentUser,
    refreshUser,
    clearUser,
    updateUserLocally,
    clearError,
  };
};
