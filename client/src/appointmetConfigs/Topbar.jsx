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
    <header className="relative bg-zinc-900/50 border-b border-slate-700/50 px-8 py-6 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Enhanced Avatar */}
            <div className="relative group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-300 to-slate-100 border border-slate-600 flex items-center justify-center text-slate-800 google-sans-code-400 text-xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-200">
                {initials}
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </div>

            {/* Text Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl google-sans-code-400 font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Welcome back, {patientName}
                </h1>
                <div className="w-1 h-1 rounded-full bg-slate-500"></div>
              </div>
              <p className="text-slate-400 google-sans-code-400 text-sm tracking-wide">
                Healthcare Dashboard
              </p>
            </div>
          </div>

          {/* Right side info */}
          <div className="hidden md:flex items-center gap-6">
            {selectedAppointment && (
              <div className="text-right">
                <div className="text-xs text-slate-500 google-sans-code-400 uppercase tracking-wider mb-1">
                  Active Appointment
                </div>
                <div className="text-sm text-white google-sans-code-400">
                  {selectedAppointment.appointmentDate} •{" "}
                  {selectedAppointment.appointmentTime}
                </div>
              </div>
            )}

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-slate-400 google-sans-code-400">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
    </header>
  );
};

export default TopBar;
