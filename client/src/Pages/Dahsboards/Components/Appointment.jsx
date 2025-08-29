import React, { useState, useEffect } from "react";
import { appointmentAPI } from "../../../services/api";

const AppointmentDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]); // Changed from 'appointment' to 'appointments'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getAppointments();
        const data = response.data.data || [];
        console.log("Fetched appointments:", data);

        setAppointments(data); // Updated variable name
        setError(null);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusClass = (status) => {
    const statusClasses = {
      confirmed: "bg-green-900/20 text-green-400 border-green-700/50",
      pending: "bg-yellow-900/20 text-yellow-400 border-yellow-700/50",
      cancelled: "bg-red-900/20 text-red-400 border-red-700/50",
      scheduled: "bg-blue-900/20 text-blue-400 border-blue-700/50", // Added scheduled status
    };
    return (
      statusClasses[status] || "bg-gray-900/20 text-gray-400 border-gray-700/50"
    );
  };

  const showAppointmentDetails = (appointmentId) => {
    const selected = appointments.find((apt) => apt._id === appointmentId); // Updated variable name
    if (selected) {
      setSelectedAppointment(selected);
      setCurrentView("details");
    }
  };

  const showDashboard = () => {
    setCurrentView("dashboard");
    setSelectedAppointment(null);
  };

  const NotificationIcon = () => (
    <svg className="w-5 h-5 fill-slate-400" viewBox="0 0 16 16">
      <path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A.5.5 0 0 1 14.5 11h-13a.5.5 0 0 1-.245-.761L2.958 8.086A.25.25 0 0 0 3 7.947V5Z" />
    </svg>
  );

  const DoctorIcon = () => (
    <svg className="w-4 h-4 fill-slate-400" viewBox="0 0 16 16">
      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
      <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v11.5A1.75 1.75 0 0 1 13.25 17H2.75A1.75 1.75 0 0 1 1 15.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0zm0 3.5h8.5a.25.25 0 0 1 .25.25V6h-11V3.75a.25.25 0 0 1 .25-.25h2zm-2.25 4v7.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5h-11z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
      <path d="M8 0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5zM8 3.75a.75.75 0 0 1 .75.75v3.5h2a.75.75 0 0 1 0 1.5h-2.75a.75.75 0 0 1-.75-.75V4.5A.75.75 0 0 1 8 3.75z" />
    </svg>
  );

  const BackIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
      <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06L6.72 3.22a.75.75 0 0 1 1.06 1.06L4.81 7.25h8.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 11.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
    </svg>
  );

  const RescheduleIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
      <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.748 1.748 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z" />
    </svg>
  );

  const TopBar = ({ selectedAppointment, currentPatient }) => (
    <header className="bg-gradient-to-r from-stone-900 to-slate-900 border-b border-slate-700 px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-600 flex items-center justify-center text-black font-mono text-lg">
            {currentPatient?.patient?.name
              ? currentPatient.patient.name.charAt(0)
              : selectedAppointment?.patient?.name
              ? selectedAppointment.patient.name.charAt(0)
              : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-mono font-semibold text-amber-50 mb-1">
              Welcome back,{" "}
              {currentPatient?.patient?.name ||
                selectedAppointment?.patient?.name ||
                "Patient"}
            </h1>
            <p className="text-slate-400 font-mono text-sm">
              Manage your healthcare appointments
            </p>
          </div>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-[#161515] border-t border-slate-700 px-6 py-4 font-mono text-center">
      <div className="flex justify-center gap-4 text-slate-400 text-sm">
        <a href="#home" className="hover:text-blue-400 transition-colors">
          Home
        </a>
        <span>·</span>
        <a
          href="#appointments"
          className="hover:text-blue-400 transition-colors"
        >
          Appointments
        </a>
        <span>·</span>
        <a href="#logout" className="hover:text-blue-400 transition-colors">
          Logout
        </a>
      </div>
    </footer>
  );

  const AppointmentCard = ({ appointment }) => (
    <div
      className="bg-gradient-to-r from-stone-900 to-slate-900 border font-mono border-slate-700 rounded-md p-4 cursor-pointer hover:border-slate-600 hover:-translate-y-px transition-all relative"
      onClick={() => showAppointmentDetails(appointment._id)}
    >
      <div className="absolute top-4 right-4 text-slate-500 text-xs font-mono">
        {appointment._id.slice(-6)}
      </div>
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <DoctorIcon />
          <div className="text-white font-semibold">
            {appointment.doctor?.name || "Unassigned"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-3 text-slate-400 text-sm">
        <div className="flex items-center gap-1">
          <CalendarIcon />
          {new Date(appointment.appointmentDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon />
          {appointment.appointmentTime}
        </div>
      </div>
      <span
        className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium border ${getStatusClass(
          appointment.status
        )}`}
      >
        {appointment.status}
      </span>
    </div>
  );

  const DashboardView = () => (
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
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );

  const DetailedView = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="flex flex-col min-h-screen bg-[#161515] font-mono text-white">
        <TopBar selectedAppointment={selectedAppointment} />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={showDashboard}
              className="flex items-center gap-2 px-3 py-2 bg-slate-500 border border-slate-700 text-black font-bold rounded-md hover:bg-slate-700 hover:border-slate-600 transition-all text-sm"
            >
              <BackIcon />
              Back to Appointments
            </button>
            <h1 className="text-2xl font-semibold">
              {selectedAppointment.doctor?.name || "Unassigned"} -{" "}
              {selectedAppointment.doctorProfile?.specialization || "N/A"}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-r from-stone-900 to-slate-900 border border-slate-700 rounded-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#161515] border border-slate-700 rounded-md p-4">
                  <div className="text-slate-400 text-sm mb-1">Date & Time</div>
                  <div className="text-white font-semibold">
                    {new Date(
                      selectedAppointment.appointmentDate
                    ).toLocaleDateString()}{" "}
                    at {selectedAppointment.appointmentTime}
                  </div>
                </div>
                <div className="bg-[#161515] border border-slate-700 rounded-md p-4">
                  <div className="text-slate-400 text-sm mb-1">Doctor</div>
                  <div className="text-white font-semibold">
                    {selectedAppointment.doctor?.name || "Not Assigned"}
                  </div>
                </div>
                <div className="bg-[#161515] border border-slate-700 rounded-md p-4">
                  <div className="text-slate-400 text-sm mb-1">
                    Specialization
                  </div>
                  <div className="text-white font-semibold">
                    {selectedAppointment.doctorProfile?.specialization || "N/A"}
                  </div>
                </div>
                <div className="bg-[#161515] border border-slate-700 rounded-md p-4">
                  <div className="text-slate-400 text-sm mb-1">Type</div>
                  <div className="text-white font-semibold">
                    {selectedAppointment.type || "Consultation"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md transition-colors">
                  <CheckIcon />
                  Confirm Appointment
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-md transition-colors">
                  <RescheduleIcon />
                  Reschedule
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-red-900/20 border border-red-500 text-red-400 rounded-md transition-colors">
                  <TrashIcon />
                  Cancel Appointment
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">
                  Preparation Notes
                </h3>
                <div className="bg-[#161515] border border-slate-700 rounded-md p-4 text-slate-400 text-sm leading-relaxed">
                  {selectedAppointment.notes || "No special preparation notes."}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-stone-900 to-slate-900 border border-slate-700 rounded-md p-4 h-fit">
              <div className="mb-5">
                <div className="text-white font-semibold text-sm mb-2">
                  Status
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium border ${getStatusClass(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>

              <div className="mb-5">
                <div className="text-white font-semibold text-sm mb-2">
                  Patient Information
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-slate-400">Patient ID:</span>
                    <span className="text-white font-medium font-mono">
                      {selectedAppointment.patient?._id?.slice(-6) || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white font-medium text-xs">
                      {selectedAppointment.patient?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-white font-semibold text-sm mb-2">
                  Appointment Details
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-slate-400">Mode:</span>
                    <span className="text-white font-medium capitalize">
                      {selectedAppointment.mode || "In-person"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white font-medium">
                      {selectedAppointment.location || "TBA"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-slate-400">Reason:</span>
                    <span className="text-white font-medium text-xs">
                      {selectedAppointment.reasonForVisit ||
                        "General consultation"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  };

  return currentView === "dashboard" ? <DashboardView /> : <DetailedView />;
};

export default AppointmentDashboard;
