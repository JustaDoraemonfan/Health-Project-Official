// components/AppointmentCard.js
import React from "react";
import { DoctorIcon, CalendarIcon, ClockIcon } from "../../Icons/Icons";
import {
  getStatusClass,
  formatDate,
  getShortId,
} from "../../utils/appointmentUtils";

const AppointmentCard = ({ appointment, onCardClick }) => {
  return (
    <div
      className="bg-[var(--color-secondary)]/80 border google-sans-code-400 border-slate-700 rounded-md p-4 cursor-pointer hover:border-slate-600 hover:-translate-y-px transition-all relative"
      onClick={() => onCardClick(appointment._id)}
    >
      <div className="absolute top-4 right-4 text-slate-500 text-xs google-sans-code-400">
        {getShortId(appointment._id)}
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <DoctorIcon />
          <div className="text-green-200 font-medium">
            {appointment.doctor?.name || "Unassigned"} •{" "}
            <span className="text-amber-200 text-sm font-light">
              {appointment.doctorProfile.specialization}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center font-light gap-4 mb-3 text-slate-100 text-sm">
        <div className="flex items-center gap-1">
          <CalendarIcon />
          {formatDate(appointment.appointmentDate)}
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon />
          {appointment.appointmentTime}
        </div>
      </div>

      <span
        className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-light border ${getStatusClass(
          appointment.status
        )}`}
      >
        {appointment.status}
      </span>
    </div>
  );
};

export default AppointmentCard;
