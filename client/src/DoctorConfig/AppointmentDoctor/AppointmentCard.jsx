import { Clock, User, MailIcon, LucideDot } from "lucide-react";

const AppointmentCard = ({ appointment, onCardClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "scheduled":
        return "bg-transparent text-green-300 border-green-800";
      case "pending":
        return "bg-transparent text-yellow-300 border-yellow-800";
      case "completed":
        return "bg-transparent text-blue-300 border-blue-800";
      case "cancelled":
        return "bg-transparent text-red-300 border-red-800";
      default:
        return "bg-transparent text-gray-300 border-gray-600";
    }
  };

  const getTypeColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "consultation":
        return "bg-transparent text-teal-800 border-teal-300";
      case "emergency":
        return "bg-transparent text-red-300";
      case "follow-up":
        return "bg-transparent text-emerald-800 border-emerald-300";
      case "check-up":
        return "bg-transparent text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Get icon colors based on status and context
  const getUserIconColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "text-emerald-400";
      case "completed":
        return "text-blue-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-indigo-400";
    }
  };

  const getClockIconColor = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "text-orange-400"; // Morning - sunrise colors
    if (hour < 17) return "text-yellow-400"; // Afternoon - sun colors
    return "text-purple-400"; // Evening - twilight colors
  };

  const getPhoneIconColor = () => "text-cyan-400";

  const getDoctorIconColor = () => "text-rose-400";

  const getUserAvatarBg = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-emerald-500/20 border-emerald-500/30";
      case "completed":
        return "bg-blue-500/20 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 border-red-500/30";
      default:
        return "bg-indigo-500/20 border-indigo-500/30";
    }
  };

  const formatTime = (timeStr) => {
    if (timeStr) return timeStr;
    // If appointment has a date, format it
    if (appointment.appointmentDate) {
      return new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "Time TBD";
  };

  return (
    <div
      className="group relative bg-[var(--color-secondary)] border border-slate-700 rounded-xl p-6  transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={() => onCardClick && onCardClick(appointment)}
    >
      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 ${getUserAvatarBg(
              appointment.status
            )} border rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300`}
          >
            <User
              className={`w-6 h-6 ${getUserIconColor(
                appointment.status
              )} group-hover:scale-110 transition-all duration-300`}
            />
          </div>
          <div>
            <h3 className="text-[var(--color-primary)] font-semibold google-sans-code-400 text-lg group-hover:text-slate-100 transition-colors">
              {appointment.patient?.name ||
                appointment.patientName ||
                "Unknown Patient"}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-white">
              <Clock
                className={`w-4 h-4 ${getClockIconColor()} group-hover:scale-110 transition-all duration-300`}
              />
              <span className="google-sans-code-400">
                {formatTime(appointment.time)}
              </span>
              {appointment.duration && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="google-sans-code-400">
                    {appointment.duration}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-end space-y-2">
          {appointment.type && (
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1.5 rounded-lg text-sm google-sans-code-400  ${getTypeColor(
                  appointment.type
                )} group-hover:scale-105 transition-transform duration-300`}
              >
                {appointment.type}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="relative z-10 space-y-3">
        {/* Appointment Type */}

        {/* Contact Information */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-white ">
            <MailIcon
              className={`w-4 h-4 mr-2 ${getPhoneIconColor()} group-hover:scale-110 transition-all duration-300`}
            />
            <span className="google-sans-code-400 text-white/70 font-light ">
              {appointment.patient?.email ||
                appointment.phone ||
                "No contact info"}
            </span>
          </div>
        </div>

        {/* Doctor Information (if viewing as patient) */}
        {appointment.doctor && (
          <div className="flex items-center text-sm text-white">
            <User
              className={`w-4 h-4 mr-2 ${getDoctorIconColor()} group-hover:scale-110 transition-all duration-300`}
            />
            <span className="google-sans-code-400">
              Dr. {appointment.doctor.name}
            </span>
            {appointment.doctorProfile?.specialization && (
              <span className="ml-2 text-orange-400">
                • {appointment.doctorProfile.specialization}
              </span>
            )}
          </div>
        )}

        {/* Notes Section */}
        {appointment.notes && (
          <div className="bg-[var(--color-primary)] rounded-lg p-3 mt-3">
            <p className="text-sm text-[var(--color-secondary)] google-sans-code-400 leading-relaxed">
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Appointment Date (if different from time) */}

        <span
          className={` rounded-full text-xs google-sans-code-400 flex justify-between p-2  ${getStatusColor(
            appointment.status
          )} group-hover:scale-105 transition-transform duration-300`}
        >
          {appointment.appointmentDate && (
            <div className="text-xs text-slate-500 google-sans-code-400 ">
              {new Date(appointment.appointmentDate).toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </div>
          )}
          <span>{appointment.status || "pending"}</span>
        </span>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className={`w-2 h-2 ${getUserIconColor(appointment.status).replace(
            "text-",
            "bg-"
          )} rounded-full animate-pulse`}
        ></div>
      </div>
    </div>
  );
};

export default AppointmentCard;
