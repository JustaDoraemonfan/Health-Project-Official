// components/DashboardView.js
import React, { useState, useMemo } from "react";
import TopBar from "./Topbar";
import Footer from "./Footer";
import AppointmentCard from "./AppointmentCards";

const DashboardView = ({
  appointments: allAppointments,
  userName,
  selectedAppointment,
  loading,
  error,
  onAppointmentClick,
}) => {
  // ========================================
  // FILTER STATE MANAGEMENT
  // ========================================
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter options configuration
  const filterOptions = [
    { value: "all", label: "All Appointments" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // ========================================
  // DATA PROCESSING & FILTERING
  // ========================================

  // Filter appointments based on selected status
  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") {
      return allAppointments || [];
    }
    return (allAppointments || []).filter(
      (appointment) =>
        appointment.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [allAppointments, statusFilter]);

  // Calculate statistics for all appointments
  const appointmentStats = useMemo(
    () => ({
      total: allAppointments?.length || 0,
      scheduled: (allAppointments || []).filter(
        (apt) => apt.status?.toLowerCase() === "scheduled"
      ).length,
      completed: (allAppointments || []).filter(
        (apt) => apt.status?.toLowerCase() === "completed"
      ).length,
      cancelled: (allAppointments || []).filter(
        (apt) => apt.status?.toLowerCase() === "cancelled"
      ).length,
    }),
    [allAppointments]
  );

  // Filter options with counts
  const filterOptionsWithCounts = useMemo(() => {
    return filterOptions.map((option) => ({
      ...option,
      count:
        option.value === "all"
          ? appointmentStats.total
          : appointmentStats[option.value] || 0,
    }));
  }, [appointmentStats]);

  // ========================================
  // FILTER HANDLERS
  // ========================================

  const handleFilterChange = (filterValue) => {
    setStatusFilter(filterValue);
  };

  const handleClearFilter = () => {
    setStatusFilter("all");
  };

  // ========================================
  // RENDER COMPONENT
  // ========================================

  return (
    <div className="flex flex-col min-h-screen google-sans-code-400 bg-[var(--color-primary)] text-white relative overflow-hidden">
      {/* ========================================
          BACKGROUND DECORATIVE ELEMENTS
          ======================================== */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-slate-600 rounded-full blur-3xl"></div>
      </div>

      {/* ========================================
          TOP BAR NAVIGATION
          ======================================== */}
      <TopBar selectedAppointment={selectedAppointment} userName={userName} />

      {/* ========================================
          MAIN CONTENT AREA
          ======================================== */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full relative z-10">
        {/* ========================================
            DASHBOARD HEADER & STATS
            ======================================== */}
        <div className="mb-10 ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light bg-[var(--color-secondary)] bg-clip-text text-transparent mb-2">
                Your Appointments
              </h1>
              <p className="text-slate-400 text-base">
                Manage and track your healthcare journey
              </p>
            </div>

            {/* Quick Stats - Desktop Only */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {appointmentStats.total}
                </div>
                <div className="text-xs text-[var(--color-secondary)] uppercase tracking-wider">
                  Total
                </div>
              </div>
              <div className="text-center px-4 py-2 bg-blue-900/30 border border-blue-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {appointmentStats.scheduled}
                </div>
                <div className="text-xs text-[var(--color-secondary)] uppercase tracking-wider">
                  Scheduled
                </div>
              </div>
              <div className="text-center px-4 py-2 bg-green-900/30 border border-green-800 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {appointmentStats.completed}
                </div>
                <div className="text-xs text-[var(--color-secondary)] uppercase tracking-wider">
                  Completed
                </div>
              </div>
              <div className="text-center px-4 py-2 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="text-2xl font-bold text-red-500">
                  {appointmentStats.cancelled}
                </div>
                <div className="text-xs text-[var(--color-secondary)] uppercase tracking-wider">
                  Cancelled
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              FILTER CONTROLS SECTION
              ======================================== */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-slate-300 font-medium">
                Filter by status:
              </span>
              <div className="flex flex-wrap gap-2">
                {filterOptionsWithCounts.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`group relative px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-200 ${
                      statusFilter === option.value
                        ? "bg-slate-600 border-slate-500 text-white"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <span className="relative z-10">
                      {option.label}
                      {option.count > 0 && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                            statusFilter === option.value
                              ? "bg-slate-500 text-white"
                              : "bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300"
                          }`}
                        >
                          {option.count}
                        </span>
                      )}
                    </span>
                    {statusFilter === option.value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-lg"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filter Indicator */}
            {statusFilter !== "all" && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Showing:</span>
                <span className="text-white font-medium capitalize">
                  {statusFilter} appointments
                </span>
                <button
                  onClick={handleClearFilter}
                  className="text-slate-400 hover:text-white underline transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* Decorative separator line */}
        </div>

        {/* ========================================
            LOADING STATE
            ======================================== */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-slate-400 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-slate-300 rounded-full animate-spin"
                style={{
                  animationDuration: "1.5s",
                  animationDirection: "reverse",
                }}
              ></div>
            </div>
            <div className="text-slate-400 mt-4 font-medium">
              Loading your appointments...
            </div>
          </div>
        )}

        {/* ========================================
            ERROR STATE
            ======================================== */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-red-900/20 border border-red-800 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="text-red-400 font-medium text-lg mb-2">
              Something went wrong
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        )}

        {/* ========================================
            EMPTY STATE
            ======================================== */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {statusFilter === "all"
                ? "No appointments yet"
                : `No ${statusFilter} appointments`}
            </h3>
            <p className="text-slate-400 text-center max-w-md">
              {statusFilter === "all"
                ? "When you schedule appointments, they'll appear here for easy management and tracking."
                : `You don't have any ${statusFilter} appointments at the moment.`}
            </p>
            {statusFilter !== "all" && (
              <button
                onClick={handleClearFilter}
                className="mt-4 px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                View all appointments
              </button>
            )}
          </div>
        )}

        {/* ========================================
            APPOINTMENTS GRID
            ======================================== */}
        {!loading && !error && filteredAppointments.length > 0 && (
          <>
            {/* Mobile Stats */}
            <div className="lg:hidden grid grid-cols-4 gap-2 mb-8">
              <div className="text-center p-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="text-lg font-bold text-white">
                  {appointmentStats.total}
                </div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
              <div className="text-center p-2 bg-blue-900/20 border border-blue-800 rounded-lg">
                <div className="text-lg font-bold text-blue-300">
                  {appointmentStats.scheduled}
                </div>
                <div className="text-xs text-blue-400">Scheduled</div>
              </div>
              <div className="text-center p-2 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="text-lg font-bold text-green-300">
                  {appointmentStats.completed}
                </div>
                <div className="text-xs text-green-400">Done</div>
              </div>
              <div className="text-center p-2 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="text-lg font-bold text-red-300">
                  {appointmentStats.cancelled}
                </div>
                <div className="text-xs text-red-400">Cancelled</div>
              </div>
            </div>

            {/* Appointment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAppointments.map((appointment, index) => (
                <div
                  key={appointment._id}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "slideInUp 0.6s ease-out forwards",
                  }}
                >
                  <AppointmentCard
                    appointment={appointment}
                    onCardClick={onAppointmentClick}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ========================================
          FOOTER SECTION
          ======================================== */}
      <Footer />

      {/* ========================================
          ANIMATIONS & STYLES
          ======================================== */}
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

export default DashboardView;
