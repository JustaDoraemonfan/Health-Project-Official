// components/AppointmentActions.js
import React from "react";
import { RescheduleIcon, TrashIcon } from "../../Icons/Icons";

const AppointmentActions = ({ onReschedule, onCancel }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-6 mb-6">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-md transition-colors"
        onClick={onReschedule}
      >
        <RescheduleIcon />
        Reschedule
      </button>

      <button
        className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-red-950/70 hover:cursor-pointer border border-red-500 text-red-400 rounded-md transition-colors"
        onClick={onCancel}
      >
        <TrashIcon />
        Cancel Appointment
      </button>
    </div>
  );
};

export default AppointmentActions;
