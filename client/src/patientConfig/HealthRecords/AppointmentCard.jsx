import React from "react";
import { Calendar } from "lucide-react";
import { getStatusBadge } from "../../utils/healthRecordUtils";

const AppointmentCard = ({ appointment }) => {
  const dateObj = new Date(appointment.appointmentDate);

  // Format date & time nicely
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
    <div className="bg-[var(--color-secondary)]/90 rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="grid grid-cols-2 gap-6 items-center">
        {/* Left Side: Date & Time */}
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex space-x-3 flex-row">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-light text-white">
                {formattedDate}
              </span>
              <span className="text-white">• {formattedTime}</span>
            </div>
            <span className={getStatusBadge(appointment.status)}>
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Right Side: Doctor Info */}
        <div className="text-right">
          <div className="text-green-300 font-medium">
            {appointment.doctor.name}
          </div>
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
      </div>
    </div>
  );
};

export default AppointmentCard;
