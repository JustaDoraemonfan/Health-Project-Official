// components/TopBar.js
import React from "react";
import { getInitials } from "../utils/appointmentUtils";

const TopBar = ({ selectedAppointment, currentPatient }) => {
  const patientName =
    currentPatient?.patient?.name ||
    selectedAppointment?.patient?.name ||
    "Patient";

  const initials = getInitials(patientName);

  return (
    <header className="bg-gradient-to-r from-stone-900 to-slate-900 border-b border-slate-700 px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-600 flex items-center justify-center text-black font-mono text-lg">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-mono font-semibold text-amber-50 mb-1">
              Welcome back, {patientName}
            </h1>
            <p className="text-slate-400 font-mono text-sm">
              Manage your healthcare appointments
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
