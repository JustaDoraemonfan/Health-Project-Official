// hooks/useDoctor.js
import { useState, useCallback, useEffect } from "react";
import { doctorAPI } from "../services/api";

/**
 * A comprehensive hook to manage all doctor-related data and actions.
 *
 * This hook handles:
 * 1. Public-facing lists (verified doctors search).
 * 2. Admin-facing lists (all doctors).
 * 3. Single doctor details (for profiles).
 * 4. Doctor-specific data (patients, availability).
 * 5. All CRUD and associated actions (verification, patient assignment).
 * 6. Granular loading and error states.
 */
export const useDoctor = () => {
  // === STATE ===

  // For lists (search results, admin lists)
  const [doctors, setDoctors] = useState([]);
  // For a single doctor's profile page
  const [currentDoctor, setCurrentDoctor] = useState(null);
  // For a doctor's dashboard
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [doctorAvailability, setDoctorAvailability] = useState(null);

  // Granular loading states
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For CUD, submit, assign, etc.

  // Error state
  const [error, setError] = useState(null);

  // === HELPER ===
  const clearError = () => setError(null);

  // === PUBLIC/PATIENT-FACING ACTIONS ===

  /**
   * Fetches ONLY verified doctors.
   * (This is your original `fetchAllDoctors` logic).
   */
  const fetchVerifiedDoctors = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const response = await doctorAPI.getDoctors();
      const data = response.data.data || [];
      const verifiedDoctors = data.filter(
        (doc) => doc.verification?.status === "verified"
      );
      setDoctors(verifiedDoctors);
    } catch (err) {
      console.error("Failed to fetch verified doctors:", err);
      setError(err.response?.data?.message || "Failed to fetch doctors");
      setDoctors([]);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  /**
   * Searches ONLY verified doctors by location.
   * (This is your original `searchDoctors` logic).
   */
  const searchVerifiedDoctors = useCallback(
    async (location) => {
      if (!location?.trim()) {
        return fetchVerifiedDoctors();
      }
      setIsLoadingList(true);
      setError(null);
      try {
        const response = await doctorAPI.searchDoctors(location);
        const data = response.data.data || response.data || [];
        const verifiedDoctors = data.filter(
          (doc) => doc.verification?.status === "verified"
        );
        setDoctors(verifiedDoctors);
      } catch (err) {
        console.error("Failed to search doctors:", err);
        setError(err.response?.data?.message || "Failed to search doctors");
        setDoctors([]);
      } finally {
        setIsLoadingList(false);
      }
    },
    [fetchVerifiedDoctors]
  );

  /**
   * Resets the search list back to all verified doctors.
   */
  const resetSearch = useCallback(() => {
    fetchVerifiedDoctors();
  }, [fetchVerifiedDoctors]);

  /**
   * Fetches a single doctor's details by their ID.
   */
  const fetchDoctorById = useCallback(async (doctorId) => {
    setIsLoadingDetails(true);
    setError(null);
    try {
      const response = await doctorAPI.getDoctor(doctorId);
      setCurrentDoctor(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch doctor by ID:", err);
      setError(err.response?.data?.message || "Could not find doctor");
      setCurrentDoctor(null);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // Initial load for public-facing pages
  useEffect(() => {
    fetchVerifiedDoctors();
  }, [fetchVerifiedDoctors]);

  // === ADMIN ACTIONS ===

  /**
   * Fetches ALL doctors (verified and unverified) for admin panels.
   */
  const fetchAllDoctorsAdmin = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const response = await doctorAPI.getDoctors();
      setDoctors(response.data.data || []); // No filter
    } catch (err) {
      console.error("Failed to fetch all doctors (admin):", err);
      setError(err.response?.data?.message || "Failed to fetch doctors");
      setDoctors([]);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  /**
   * Creates a new doctor (Admin only).
   * Refetches the admin list on success.
   */
  const createDoctor = useCallback(
    async (doctorData) => {
      setIsUpdating(true);
      setError(null);
      try {
        await doctorAPI.createDoctor(doctorData);
        await fetchAllDoctorsAdmin(); // Refresh admin list
      } catch (err) {
        console.error("Failed to create doctor:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to create doctor";
        setError(errorMsg);
        throw new Error(errorMsg); // Re-throw for form handling
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAllDoctorsAdmin]
  );

  /**
   * Updates a doctor (Admin only).
   * Refetches list and current doctor details on success.
   */
  const updateDoctor = useCallback(
    async (doctorId, data) => {
      setIsUpdating(true);
      setError(null);
      try {
        await doctorAPI.updateDoctor(doctorId, data);
        await fetchAllDoctorsAdmin(); // Refresh admin list
        // If we are viewing the doctor being updated, refresh their details
        if (currentDoctor?._id === doctorId) {
          await fetchDoctorById(doctorId);
        }
      } catch (err) {
        console.error("Failed to update doctor:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to update doctor";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAllDoctorsAdmin, fetchDoctorById, currentDoctor?._id]
  );

  /**
   * Deletes a doctor (Admin only).
   * Refetches the admin list on success.
   */
  const deleteDoctor = useCallback(
    async (doctorId) => {
      setIsUpdating(true);
      setError(null);
      try {
        await doctorAPI.deleteDoctor(doctorId);
        await fetchAllDoctorsAdmin(); // Refresh admin list
      } catch (err) {
        console.error("Failed to delete doctor:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to delete doctor";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchAllDoctorsAdmin]
  );

  // === DOCTOR DASHBOARD ACTIONS ===

  /**
   * Fetches the logged-in doctor's assigned patients.
   */
  const fetchDoctorPatients = useCallback(async () => {
    setIsLoadingDetails(true); // Re-use details loader
    setError(null);
    try {
      const response = await doctorAPI.getDoctorPatients();
      setDoctorPatients(response.data.data || response.data || []);
    } catch (err) {
      console.error("Failed to fetch doctor's patients:", err);
      setError(err.response?.data?.message || "Failed to fetch patients");
      setDoctorPatients([]);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  /**
   * Assigns a patient to a doctor.
   */
  const assignPatient = useCallback(async (doctorId, patientId) => {
    setIsUpdating(true);
    setError(null);
    try {
      await doctorAPI.assignPatient(doctorId, patientId);
      // Optionally refetch patients if on dashboard
      // await fetchDoctorPatients();
    } catch (err) {
      console.error("Failed to assign patient:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to assign patient";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Unassigns a patient from a doctor.
   */
  const unassignPatient = useCallback(
    async (doctorId, patientId) => {
      setIsUpdating(true);
      setError(null);
      try {
        await doctorAPI.unassignPatient(doctorId, patientId);
        await fetchDoctorPatients(); // Refresh patient list
      } catch (err) {
        console.error("Failed to unassign patient:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to unassign patient";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchDoctorPatients]
  );

  /**
   * Fetches the logged-in doctor's availability.
   */
  const fetchAvailability = useCallback(async () => {
    setIsLoadingDetails(true);
    setError(null);
    try {
      const response = await doctorAPI.getAvailability();
      setDoctorAvailability(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      setError(err.response?.data?.message || "Failed to fetch availability");
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  /**
   * Saves the logged-in doctor's availability.
   */
  const saveAvailability = useCallback(async (availabilityData) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await doctorAPI.setAvailability(availabilityData);
      setDoctorAvailability(response.data.data || response.data); // Update state
    } catch (err) {
      console.error("Failed to save availability:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to save availability";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Submits verification documents for the logged-in doctor.
   */
  const submitVerification = useCallback(async (formData) => {
    setIsUpdating(true);
    setError(null);
    try {
      await doctorAPI.submitDoctorVerification(formData);
      // You might want to refetch the current user/doctor data here
    } catch (err) {
      console.error("Failed to submit verification:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to submit verification";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // === RETURN VALUE ===
  return {
    // State
    doctors,
    currentDoctor,
    doctorPatients,
    doctorAvailability,

    // Loading States
    isLoadingList,
    isLoadingDetails,
    isUpdating,

    // Error State
    error,
    clearError,

    // Public/Patient Functions
    fetchVerifiedDoctors,
    searchVerifiedDoctors,
    resetSearch,
    fetchDoctorById,

    // Admin Functions
    fetchAllDoctorsAdmin,
    createDoctor,
    updateDoctor,
    deleteDoctor,

    // Doctor Dashboard Functions
    fetchDoctorPatients,
    assignPatient,
    unassignPatient,
    fetchAvailability,
    saveAvailability,
    submitVerification,
  };
};
