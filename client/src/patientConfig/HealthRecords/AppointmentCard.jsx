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
      {/* Main layout: 
        - Mobile: Stacks vertically (flex-col) with a smaller gap.
        - Medium screens (md) & up: Becomes a 2-column grid.
      */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 md:items-center">
        {/* Left Side: Date & Time */}
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg flex-shrink-0">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>

          {/* Date/Time/Status layout:
            - Mobile: Stacks vertically (flex-col).
            - Small screens (sm) & up: Becomes horizontal.
          */}
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:space-x-3">
            {/* Date & Time wrapper: Allows wrapping on very small screens */}
            <div className="flex items-center flex-wrap gap-x-3">
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

        {/* Right Side: Doctor Info
          - Mobile: Text is aligned left.
          - Medium screens (md) & up: Text is aligned right.
        */}
        <div className="text-left md:text-right">
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
