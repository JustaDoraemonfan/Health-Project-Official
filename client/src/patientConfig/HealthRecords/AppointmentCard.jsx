import React, { useState } from "react";
import { Calendar, Eye } from "lucide-react"; // Imported Eye icon

// Removed the failing import:
// import { getStatusBadge } from "../../utils/healthRecordUtils";

// --- ADDED LOCAL HELPER FUNCTION ---
// Added a local version of getStatusBadge to remove the broken import.
const getStatusBadge = (status) => {
  const lowerStatus = status?.toLowerCase() || "";
  switch (lowerStatus) {
    case "scheduled":
    case "upcoming":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200";
  }
};
// --- END OF LOCAL HELPER ---

const AppointmentCard = ({ appointment }) => {
  // --- NEW STATE ---
  // State to manage the expanded details view
  const [isExpanded, setIsExpanded] = useState(false);

  // Date & Time formatting (unchanged)
  const dateObj = new Date(appointment.appointmentDate);

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long", // Friday
    month: "short", // Sep
    day: "numeric", // 26
    year: "numeric", // 2025
  });

  const formattedTime = new Date(
    `${appointment.appointmentDate.split("T")[0]}T${
      appointment.appointmentTime
    }`
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-[var(--color-secondary)] rounded-xl shadow-sm border spline-sans-mono-400 border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
      {/* Main layout: Icon on left, content on right */}
      <div className="flex items-start space-x-4">
        {/* Icon (Always visible) */}
        <div className="bg-blue-50 p-3 rounded-lg flex-shrink-0">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Top section: Summary Info (Date, Time, Doctor, Status) */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
            {/* Left side: Date, Time, Doctor */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-3">
                <span className="text-lg font-light text-white">
                  {formattedDate}
                </span>
                <span className="text-white">• {formattedTime}</span>
              </div>
              <div className="text-green-300 font-medium mt-1">
                {appointment.doctor.name}
              </div>
            </div>

            {/* Right side: Status Badge */}
            <div className="flex-shrink-0">
              <span className={getStatusBadge(appointment.status)}>
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </span>
            </div>
          </div>

          {/* --- CONDITIONALLY RENDERED DETAILS --- */}
          {isExpanded && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Doctor's Details
              </h4>
              <div className="text-slate-100 text-sm">
                {appointment.doctor.email}
              </div>
              <div className="text-slate-400 text-xs mt-1">
                <span className="text-red-500">
                  {appointment.doctorProfile.specialization}
                </span>{" "}
                • {appointment.doctorProfile.experience} yrs exp
              </div>
            </div>
          )}
          {/* --- END OF CONDITIONAL DETAILS --- */}

          {/* Action Button (Always visible) */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 rounded-lg transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              {isExpanded ? "Hide Details" : "View Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
