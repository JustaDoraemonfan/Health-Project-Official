// hooks/useDoctors.js
import { useState, useEffect } from "react";
import { doctorAPI } from "../services/api";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getDoctors();
      const data = response.data.data || [];
      // ✅ Filter only verified doctors
      const verifiedDoctors = data.filter(
        (doc) => doc.verification?.status === "verified"
      );
      console.log("Verified doctors loaded:", verifiedDoctors);
      setDoctors(verifiedDoctors);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = async (location) => {
    if (!location.trim()) {
      return fetchAllDoctors();
    }

    try {
      setSearchLoading(true);
      const response = await doctorAPI.searchDoctors(location);
      const data = response.data.data || response.data || [];
      // ✅ Filter verified doctors
      const verifiedDoctors = data.filter(
        (doc) => doc.verification?.status === "verified"
      );
      setDoctors(verifiedDoctors);
    } catch (err) {
      console.error("Failed to search doctors:", err);
      setDoctors([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const resetSearch = async () => {
    try {
      setSearchLoading(true);
      await fetchAllDoctors();
    } catch (err) {
      console.error("Failed to reset search:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  return {
    doctors,
    loading,
    searchLoading,
    searchDoctors,
    resetSearch,
    fetchAllDoctors,
  };
};
