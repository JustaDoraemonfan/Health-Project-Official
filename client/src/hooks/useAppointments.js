import { useState, useEffect, use } from "react";
import { appointmentAPI, dashboardAPI } from "../services/api";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState({});

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getUpcomingAppointments();
      const userResponse = await dashboardAPI.getPatientDashboard();
      const data = response.data.data || [];
      const userData = userResponse.data.data;
      console.log("Fetched appointments:", data);
      setUserName(userData.user);
      console.log(userData);

      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const findAppointmentById = (appointmentId) => {
    return appointments.find((apt) => apt._id === appointmentId);
  };

  const confirmAppointment = async (appointment) => {
    try {
      // Add API call to confirm appointment
      console.log("Confirming appointment:", appointment._id);
      // await appointmentAPI.confirmAppointment(appointment._id);
      // fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Failed to confirm appointment:", err);
    }
  };

  const rescheduleAppointment = async (appointment) => {
    try {
      // Add API call to reschedule appointment
      console.log("Rescheduling appointment:", appointment._id);
      // await appointmentAPI.rescheduleAppointment(appointment._id);
      // fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Failed to reschedule appointment:", err);
    }
  };

  const cancelAppointment = async (appointment) => {
    try {
      // Add API call to cancel appointment
      await appointmentAPI.cancelAppointment(appointment._id);
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  return {
    appointments,
    userName,
    loading,
    error,
    findAppointmentById,
    confirmAppointment,
    rescheduleAppointment,
    cancelAppointment,
    refetchAppointments: fetchAppointments,
  };
};
