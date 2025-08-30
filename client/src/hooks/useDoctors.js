// hooks/useDoctors.js
import { useState, useEffect } from "react";
import { doctorAPI } from "../services/api";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load all doctors initially
  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getDoctors();
      const data = response.data.data;
      console.log("All doctors loaded:", data);
      setDoctors(data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = async (location) => {
    if (!location.trim()) {
      // If no location entered, reload all doctors
      return fetchAllDoctors();
    }

    try {
      setSearchLoading(true);
      const response = await doctorAPI.searchDoctors(location);
      const data = response.data.data || response.data;
      console.log("Search results:", data);
      setDoctors(data || []);
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
