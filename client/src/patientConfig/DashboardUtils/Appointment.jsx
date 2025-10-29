// AppointmentDashboard.js
import React, { useState } from "react";
import DashboardView from "../AppointmentPatient/DashboardView";
import DetailedView from "../AppointmentPatient/DetailedView";
import { useAppointments } from "../../hooks/useAppointments";
import Header from "../../components/Header";

const AppointmentDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const {
    appointments,
    userName,
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

  const handleCancelAppointment = (appointment, reasonForCancellation) => {
    cancelAppointment(appointment, reasonForCancellation);
    // You might want to show a confirmation dialog first
  };

  // The Header is now placed outside the conditional rendering, so it's always visible.
  return (
    // This div wrapper manages the overall page layout and background.
    <div className="bg-[var(--color-primary)] min-h-screen">
      <Header isNotDashboard={true} />

      <main className="pt-20">
        {currentView === "dashboard" ? (
          <DashboardView
            appointments={appointments}
            selectedAppointment={selectedAppointment}
            loading={loading}
            error={error}
            userName={userName}
            onAppointmentClick={showAppointmentDetails}
          />
        ) : (
          <DetailedView
            selectedAppointment={selectedAppointment}
            userName={userName}
            onBackToDashboard={showDashboard}
            onRescheduleAppointment={handleRescheduleAppointment}
            onCancelAppointment={handleCancelAppointment}
            appointmentStatus={selectedAppointment?.status}
          />
        )}
      </main>
    </div>
  );
};

export default AppointmentDashboard;
