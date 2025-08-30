// AppointmentDashboard.js
import React, { useState } from "react";
import DashboardView from "../../appointmetConfigs/DashboardView";
import DetailedView from "../../appointmetConfigs/DetailedView";
import { useAppointments } from "../../hooks/useAppointments";

const AppointmentDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const {
    appointments,
    loading,
    error,
    findAppointmentById,
    rescheduleAppointment,
    cancelAppointment,
  } = useAppointments();

  const showAppointmentDetails = (appointmentId) => {
    const selected = findAppointmentById(appointmentId);
    if (selected) {
      setSelectedAppointment(selected);
      setCurrentView("details");
    }
  };

  const showDashboard = () => {
    setCurrentView("dashboard");
    setSelectedAppointment(null);
  };

  const handleRescheduleAppointment = (appointment) => {
    rescheduleAppointment(appointment);
    // You might want to open a reschedule modal or navigate to a reschedule page
  };

  const handleCancelAppointment = (appointment) => {
    cancelAppointment(appointment);
    // You might want to show a confirmation dialog first
  };

  if (currentView === "dashboard") {
    return (
      <DashboardView
        appointments={appointments}
        selectedAppointment={selectedAppointment}
        loading={loading}
        error={error}
        onAppointmentClick={showAppointmentDetails}
      />
    );
  }

  return (
    <DetailedView
      selectedAppointment={selectedAppointment}
      onBackToDashboard={showDashboard}
      onRescheduleAppointment={handleRescheduleAppointment}
      onCancelAppointment={handleCancelAppointment}
      appointmentStatus={appointments.status}
    />
  );
};

export default AppointmentDashboard;
