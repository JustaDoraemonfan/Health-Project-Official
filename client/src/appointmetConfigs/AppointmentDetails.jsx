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
      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-200 border border-slate-700 rounded-md p-4">
          <div className="text-slate-400 text-sm mb-1">Date & Time</div>
          <div className="text-black font-semibold">
            {formatDate(appointment.appointmentDate)} at{" "}
            {appointment.appointmentTime}
          </div>
        </div>

        <div className="bg-slate-200 border border-slate-700 rounded-md p-4">
          <div className="text-slate-400 text-sm mb-1">Doctor</div>
          <div className="text-black font-semibold">
            {appointment.doctor?.name || "Not Assigned"}
          </div>
        </div>

        <div className="bg-slate-200 border border-slate-700 rounded-md p-4">
          <div className="text-slate-400 text-sm mb-1">Specialization</div>
          <div className="text-black font-semibold">
            {appointment.doctorProfile?.specialization || "N/A"}
          </div>
        </div>

        <div className="bg-slate-200 border border-slate-700 rounded-md p-4">
          <div className="text-slate-400 text-sm mb-1">Type</div>
          <div className="text-black font-semibold">
            {appointment.type || "Consultation"}
          </div>
        </div>
      </div>

      {/* Preparation Notes */}
      <div className="mt-6">
        <h3 className="text-amber-50 font-semibold mb-3">Preparation Notes</h3>
        <div className="bg-slate-200 border border-slate-700 rounded-md p-4 text-gray-950 text-sm leading-relaxed">
          {appointment.notes || "No special preparation notes."}
        </div>
      </div>
    </>
  );
};

export const AppointmentSidebar = ({ appointment }) => {
  if (!appointment) return null;

  return (
    <div className="bg-gradient-to-r from-stone-900 to-slate-900 border border-slate-700 rounded-md p-4 h-fit">
      {/* Status */}
      <div className="mb-5">
        <div className="text-amber-50 font-semibold text-md mb-2">Status</div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium border ${getStatusClass(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>
      </div>

      {/* Patient Information */}
      <div className="mb-5">
        <div className="text-amber-50 font-semibold text-md mb-2">
          Patient Information
        </div>
        <div className="space-y-1">
          <div className="flex justify-start items-center py-1 text-sm">
            <span className="text-slate-400">Patient ID:</span>
            <span className="text-amber-50 font-medium font-mono">
              {getShortId(appointment.patient?._id)}
            </span>
          </div>
          <div className="flex justify-start items-center py-1 text-sm">
            <span className="text-slate-400">Email:</span>
            <span className="text-amber-50 font-medium text-xs">
              {appointment.patient?.email || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div>
        <div className="ttext-amber-50 font-semibold text-md mb-2">
          Appointment Details
        </div>
        <div className="space-y-1">
          <div className="flex justify-start items-center py-1 text-sm">
            <span className="text-slate-400">Mode:</span>
            <span className="text-amber-50 font-medium capitalize">
              {appointment.mode || "In-person"}
            </span>
          </div>
          <div className="flex justify-start items-center py-1 text-sm">
            <span className="text-slate-400">Location:</span>
            <span className="text-amber-50 font-medium">
              {appointment.location || "TBA"}
            </span>
          </div>
          <div className="flex justify-start items-center py-1 text-sm">
            <span className="text-slate-400">Reason:</span>
            <span className="text-amber-50 font-medium text-xs">
              {appointment.reasonForVisit || "General consultation"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
