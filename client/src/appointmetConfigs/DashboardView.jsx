// components/DashboardView.js
import React from "react";
import TopBar from "./Topbar";
import Footer from "./Footer";
import AppointmentCard from "./AppointmentCards";

const DashboardView = ({
  appointments,
  selectedAppointment,
  loading,
  error,
  onAppointmentClick,
}) => {
  return (
    <div className="flex flex-col min-h-screen font-mono bg-[#161515] text-white">
      <TopBar
        selectedAppointment={selectedAppointment}
        currentPatient={appointments[0]}
      />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Upcoming Appointments</h1>
          <p className="text-slate-400 text-sm">
            View and manage your scheduled medical appointments
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-slate-400">Loading appointments...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-400">{error}</div>
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="text-center py-8">
            <div className="text-slate-400">No appointments found</div>
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCardClick={onAppointmentClick}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardView;
