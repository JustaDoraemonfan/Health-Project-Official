import React, { useState } from "react";
import { Calendar, Bell } from "lucide-react";
import Header from "../../DoctorConfig/AppointmentDoctor/Header";
import SearchFilter from "../../DoctorConfig/AppointmentDoctor/SearchFilter";
import AppointmentCard from "../../DoctorConfig/AppointmentDoctor/AppointmentCard";
import StatsCard from "../../DoctorConfig/AppointmentDoctor/StatsCard";
import { useAppointments } from "../..//hooks/useAppointments";

const DoctorAppointment = () => {
  const {
    appointments,
    loading,
    error,
    findAppointmentById,
    rescheduleAppointment,
    cancelAppointment,
  } = useAppointments();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter((appointment) => {
    // Fixed typos: appointments -> appointment, inclues -> includes
    const matchesSearch =
      appointment.patient?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || appointment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const confirmedCount = appointments.filter(
    (apt) => apt.status === "confirmed" || apt.status === "scheduled"
  ).length;

  const pendingCount = appointments.filter(
    (apt) => apt.status === "pending"
  ).length;

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#161515] text-white google-sans-code-400 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-emerald-400 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-zinc-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#161515] text-white google-sans-code-400 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900/20 border border-red-800 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Bell className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-red-400 font-medium text-lg mb-2">
            Error Loading Appointments
          </h2>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161515] text-white google-sans-code-400 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-slate-600 rounded-full blur-3xl"></div>
      </div>

      <Header
        currentDate={currentDate}
        totalAppointments={appointments.length}
        confirmedCount={confirmedCount}
        pendingCount={pendingCount}
      />

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <main className="p-6 max-w-7xl mx-auto w-full relative z-10">
        {/* Stats Section - Updated to match the clean design */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total"
            value={appointments.length}
            color="text-white"
          />
          <StatsCard
            title="Confirmed"
            value={confirmedCount}
            color="text-emerald-400"
          />
          <StatsCard
            title="Pending"
            value={pendingCount}
            color="text-amber-400"
          />
        </div>

        {/* Appointments Section */}
        <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-xl">
          <div className="px-6 py-4 border-b border-zinc-800/30">
            <h2 className="text-xl font-bold text-white google-sans-code-400">
              Today's Appointments
            </h2>
            <p className="text-sm text-zinc-400 google-sans-code-400">
              {filteredAppointments.length} of {appointments.length}{" "}
              appointments
            </p>
          </div>

          <div className="p-6">
            {filteredAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Fixed: use filteredAppointments instead of appointments */}
                {filteredAppointments.map((appointment, index) => (
                  <div
                    key={appointment._id || appointment.id || index} // Better key handling
                    className="transform transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "slideInUp 0.6s ease-out forwards",
                    }}
                  >
                    <AppointmentCard
                      appointment={appointment}
                      onCardClick={(apt) =>
                        console.log("Clicked appointment:", apt)
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-10 h-10 text-zinc-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {filterStatus === "all"
                    ? "No appointments yet"
                    : `No ${filterStatus} appointments`}
                </h3>
                <p className="text-zinc-400 text-center max-w-md google-sans-code-400">
                  {filterStatus === "all"
                    ? "When appointments are scheduled, they'll appear here for easy management."
                    : `No ${filterStatus} appointments found. Try adjusting your filters.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorAppointment;
