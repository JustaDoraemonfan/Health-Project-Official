import { useState, useCallback } from "react";
// Assuming 'apiClient' is imported and configured in '../services/api'
import { patientAPI } from "../services/api";

/**
 * Hook to manage all patient-related data and actions.
 *
 * This hook handles:
 * 1. Admin/Doctor-facing patient lists.
 * 2. Single patient details (for profiles).
 * 3. All CRUD actions for patients.
 * 4. Granular loading and error states.
 */
export const usePatient = () => {
  // === STATE ===

  // For lists (admin, doctor dashboard)
  const [patients, setPatients] = useState([]);
  // For a single patient's profile page
  const [currentPatient, setCurrentPatient] = useState(null);

  // Granular loading states
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For Create, Update, Delete

  // Error state
  const [error, setError] = useState(null);

  // === HELPER ===
  const clearError = () => setError(null);

  // === API ACTIONS ===

  /**
   * Fetches ALL patients (for admin/doctor).
   */
  const fetchAllPatients = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const response = await patientAPI.getPatients();
      setPatients(response.data.data || response.data || []);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to fetch patients";
      setError(errorMsg);
      setPatients([]);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  /**
   * Fetches a single patient's details by their ID.
   */
  const fetchPatientById = useCallback(async (patientId) => {
    if (!patientId) {
      setCurrentPatient(null);
      return;
    }
    setIsLoadingDetails(true);
    setError(null);
    try {
      const response = await patientAPI.getPatient(patientId);
      setCurrentPatient(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch patient by ID:", err);
      const errorMsg = err.response?.data?.message || "Could not find patient";
      setError(errorMsg);
      setCurrentPatient(null);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  /**
   * Creates a new patient.
   * Refetches the patient list on success.
   */
  const createPatient = useCallback(
    async (patientData) => {
      setIsUpdating(true);
      setError(null);
      try {
        await patientAPI.createPatient(patientData);
        await fetchAllPatients(); // Refresh list
      } catch (err) {
        console.error("Failed to create patient:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to create patient";
        setError(errorMsg);
        throw new Error(errorMsg); // Re-throw for form handling
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAllPatients]
  );

  /**
   * Updates a patient's profile.
   * Refetches list and (if needed) current patient details on success.
   */
  const updatePatient = useCallback(
    async (patientId, data) => {
      setIsUpdating(true);
      setError(null);
      try {
        const response = await patientAPI.updatePatient(patientId, data);
        await fetchAllPatients(); // Refresh list

        // If we are viewing the patient being updated, refresh their details
        if (currentPatient?._id === patientId) {
          // Update currentPatient state with the new data from response
          setCurrentPatient(response.data.data || response.data);
        }
      } catch (err) {
        console.error("Failed to update patient:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to update patient";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAllPatients, currentPatient?._id]
  );

  /**
   * Deletes a patient (Admin only).
   * Refetches the patient list on success.
   */
  const deletePatient = useCallback(
    async (patientId) => {
      setIsUpdating(true);
      setError(null);
      try {
        await patientAPI.deletePatient(patientId);
        await fetchAllPatients(); // Refresh list
        if (currentPatient?._id === patientId) {
          setCurrentPatient(null); // Clear details if we deleted the one we're viewing
        }
      } catch (err) {
        console.error("Failed to delete patient:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to delete patient";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAllPatients, currentPatient?._id]
  );

  // === RETURN VALUE ===
  return {
    // State
    patients,
    currentPatient,

    // Loading States
    isLoadingList,
    isLoadingDetails,
    isUpdating,

    // Error State
    error,
    clearError,

    // Functions
    fetchAllPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
  };
};
