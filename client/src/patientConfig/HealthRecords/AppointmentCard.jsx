import React from "react";
import { Calendar } from "lucide-react";
import { getStatusBadge } from "../../utils/healthRecordUtils";

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-[var(--color-secondary)] rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-light text-white">
                  {appointment.appointmentDate}
                </span>
                <span className="text-white">
                  at {appointment.appointmentTime}
                </span>
                <span className={getStatusBadge(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
              </div>
              <div className="text-slate-400 mt-1">
                <span className="font-medium">{appointment.doctor.name}</span> •{" "}
                {appointment.doctor.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
