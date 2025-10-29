import { useState, useCallback, useEffect } from "react";
import { appointmentAPI, authAPI, dashboardAPI } from "../services/api";

/**
 * A comprehensive hook to manage all appointment-related data and actions.
 *
 * This hook is designed to be a backward-compatible replacement for the
 * original `useAppointments` hook, while adding more comprehensive
 * state management and API functions.
 */
export const useAppointments = () => {
  // === STATE ===

  // State for backward compatibility
  const [appointments, setAppointments] = useState([]); // This will hold the UPCOMING list
  const [userName, setUserName] = useState({});
  const [error, setError] = useState(null);

  // New comprehensive state
  const [pastAppointments, setPastAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);

  // Granular loading states
  const [isLoadingList, setIsLoadingList] = useState(true); // Default true to match old hook
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For CUD, confirm, cancel

  // === HELPER ===
  const clearError = () => setError(null);

  // === CORE FUNCTIONS ===

  /**
   * Fetches upcoming appointments AND user info.
   * This is the original `fetchAppointments` logic, preserved
   * for backward compatibility.
   */
  const fetchAppointments = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      // Fetch upcoming appointments and current user in parallel
      const [response, currentUserResponse] = await Promise.all([
        appointmentAPI.getUpcomingAppointments(),
        authAPI.getCurrentUser(),
      ]);

      const currentUser = currentUserResponse.data;

      // This logic is from the old hook and is preserved for compatibility
      const userResponse =
        currentUser.role === "patient"
          ? await dashboardAPI.getPatientDashboard()
          : await dashboardAPI.getDoctorDashboard();

      const data = response.data.data || [];
      const userData = userResponse.data.data;

      console.log("Fetched appointments:", data);
      setUserName(userData.user.name);
      console.log(userData.user.name);

      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to load appointments";
      setError(errorMsg);
      setAppointments([]); // Clear on error
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // Auto-fetch on mount (matches old hook's behavior)
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /**
   * (From old hook) Finds an appointment in the *local* upcoming list.
   * For API-based fetching, use `fetchAppointmentById`.
   */
  const findAppointmentById = (appointmentId) => {
    return appointments.find((apt) => apt._id === appointmentId);
  };

  /**
   * Cancels an appointment.
   * (Improved from old hook)
   */
  const cancelAppointment = useCallback(
    async (appointment, reasonForCancellation) => {
      setIsUpdating(true);
      setError(null);
      try {
        await appointmentAPI.cancelAppointment(
          appointment._id,
          reasonForCancellation
        );
        await fetchAppointments(); // Refresh the list
      } catch (err) {
        console.error("Failed to cancel appointment:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to cancel appointment";
        setError(errorMsg);
        throw new Error(errorMsg); // Re-throw for modal/form handling
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAppointments]
  );

  /**
   * Confirms an appointment.
   * (Implemented from old hook)
   */
  const confirmAppointment = useCallback(
    async (appointment) => {
      setIsUpdating(true);
      setError(null);
      try {
        console.log("Confirming appointment:", appointment._id);
        await appointmentAPI.confirmAppointment(appointment._id);
        await fetchAppointments(); // Refresh the list
      } catch (err) {
        console.error("Failed to confirm appointment:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to confirm appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAppointments]
  );

  /**
   * Reschedules (updates) an appointment.
   * (Implemented from old hook)
   */
  const rescheduleAppointment = useCallback(
    async (appointmentId, data) => {
      setIsUpdating(true);
      setError(null);
      try {
        console.log("Rescheduling appointment:", appointmentId);
        await appointmentAPI.updateAppointment(appointmentId, data);
        await fetchAppointments(); // Refresh the list
      } catch (err) {
        console.error("Failed to reschedule appointment:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to reschedule appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAppointments]
  );

  // === NEW COMPREHENSIVE FUNCTIONS ===

  /**
   * Books a new appointment.
   */
  const bookAppointment = useCallback(
    async (appointmentData) => {
      setIsUpdating(true);
      setError(null);
      try {
        const response = await appointmentAPI.bookAppointment(appointmentData);
        await fetchAppointments(); // Refresh upcoming list
        return response.data; // Return new appointment data
      } catch (err) {
        console.error("Failed to book appointment:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to book appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAppointments]
  );

  /**
   * Fetches a single appointment by ID from the API.
   */
  const fetchAppointmentById = useCallback(async (appointmentId) => {
    setIsLoadingDetails(true);
    setError(null);
    try {
      const response = await appointmentAPI.getAppointment(appointmentId);
      setCurrentAppointment(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch appointment by ID:", err);
      const errorMsg =
        err.response?.data?.message || "Could not find appointment";
      setError(errorMsg);
      setCurrentAppointment(null);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  /**
   * Fetches past appointments.
   */
  const fetchPastAppointments = useCallback(async () => {
    setIsLoadingList(true); // Use main list loader
    setError(null);
    try {
      const response = await appointmentAPI.getPastAppointments();
      setPastAppointments(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch past appointments:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to load past appointments";
      setError(errorMsg);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  /**
   * Completes an appointment.
   */
  const completeAppointment = useCallback(
    async (appointmentId, notes) => {
      setIsUpdating(true);
      setError(null);
      try {
        await appointmentAPI.completeAppointment(appointmentId, notes);
        await fetchAppointments(); // Refreshes upcoming
        await fetchPastAppointments(); // Refreshes past (if it's now in past)
      } catch (err) {
        console.error("Failed to complete appointment:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to complete appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAppointments, fetchPastAppointments]
  );

  /**
   * Deletes an appointment.
   */
  const deleteAppointment = useCallback(
    async (appointmentId) => {
      setIsUpdating(true);
      setError(null);
      try {
        await appointmentAPI.deleteAppointment(appointmentId);
        await fetchAppointments(); // Refresh list
      } catch (err) {
        console.error("Failed to delete appointment:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to delete appointment";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAppointments]
  );

  /**
   * Fetches appointment statistics.
   */
  const fetchAppointmentStats = useCallback(async () => {
    setIsLoadingDetails(true); // Use details loader
    setError(null);
    try {
      const response = await appointmentAPI.getAppointmentStats();
      setAppointmentStats(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch appointment stats:", err);
      const errorMsg = err.response?.data?.message || "Failed to load stats";
      setError(errorMsg);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // === RETURN VALUE ===
  return {
    // --- Compatibility with old hook ---
    appointments, // This is the UPCOMING list
    userName,
    loading: isLoadingList, // Map new state to old name
    error,
    findAppointmentById, // The local .find()
    confirmAppointment,
    rescheduleAppointment, // This is the `update` function
    cancelAppointment,
    refetchAppointments: fetchAppointments, // Map to old name

    // --- New comprehensive properties ---
    pastAppointments,
    currentAppointment,
    appointmentStats,

    // New granular state
    isLoadingList,
    isLoadingDetails,
    isUpdating,

    // New functions
    clearError,
    bookAppointment,
    fetchAppointmentById, // The API-based fetcher
    fetchPastAppointments,
    fetchAppointmentStats,
    completeAppointment,
    deleteAppointment,
    updateAppointment: rescheduleAppointment, // Alias for consistency
  };
};
