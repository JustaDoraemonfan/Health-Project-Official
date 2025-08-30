// components/AppointmentDetails.js
import React from "react";
import {
  formatDate,
  getStatusClass,
  getShortId,
} from "../utils/appointmentUtils";

const AppointmentDetails = ({ appointment }) => {
  if (!appointment) return null;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-1">
          Appointment Details
        </h2>
        <div className="h-px bg-slate-600 w-16"></div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/70 transition-colors duration-200">
          <div className="text-slate-300 text-xs uppercase tracking-wider font-medium mb-2">
            Date & Time
          </div>
          <div className="text-white font-semibold text-lg">
            {formatDate(appointment.appointmentDate)}
          </div>
          <div className="text-slate-300 text-sm mt-1">
            {appointment.appointmentTime}
          </div>
        </div>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/70 transition-colors duration-200">
          <div className="text-slate-300 text-xs uppercase tracking-wider font-medium mb-2">
            Doctor
          </div>
          <div className="text-white font-semibold text-lg">
            {appointment.doctor?.name || "Not Assigned"}
          </div>
        </div>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/70 transition-colors duration-200">
          <div className="text-slate-300 text-xs uppercase tracking-wider font-medium mb-2">
            Specialization
          </div>
          <div className="text-white font-semibold">
            {appointment.doctorProfile?.specialization || "N/A"}
          </div>
        </div>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/70 transition-colors duration-200">
          <div className="text-slate-300 text-xs uppercase tracking-wider font-medium mb-2">
            Type
          </div>
          <div className="text-white font-semibold">
            {appointment.type || "Consultation"}
          </div>
        </div>
      </div>

      {/* Preparation Notes */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-white font-semibold text-lg">
            Preparation Notes
          </h3>
          <div className="flex-1 h-px bg-slate-600"></div>
        </div>
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-5">
          <div className="text-slate-200 text-sm leading-relaxed">
            {appointment.notes ||
              "No special preparation notes required for this appointment."}
          </div>
        </div>
      </div>
    </>
  );
};

export const AppointmentSidebar = ({ appointment }) => {
  if (!appointment) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 h-fit space-y-6">
      {/* Status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Status</h3>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusClass(
            appointment.status
          )}`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current mr-2"></div>
          {appointment.status?.charAt(0).toUpperCase() +
            appointment.status?.slice(1)}
        </span>
      </div>

      {/* Patient Information */}
      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-white font-semibold mb-4">Patient Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm">Patient ID</span>
            <span className="text-white font-mono text-sm bg-slate-700 px-2 py-1 rounded">
              {getShortId(appointment.patient?._id)}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm">Email</span>
            <span className="text-white text-sm text-right max-w-[140px] truncate">
              {appointment.patient?.email || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-white font-semibold mb-4">Additional Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Mode</span>
            <span className="text-white font-medium capitalize bg-slate-700 px-2 py-1 rounded text-sm">
              {appointment.mode || "In-person"}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm">Location</span>
            <span className="text-white text-sm text-right max-w-[120px]">
              {appointment.location || "TBA"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-400 text-sm">Reason</span>
            <span className="text-white text-sm bg-slate-700/50 p-2 rounded text-right">
              {appointment.reasonForVisit || "General consultation"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
