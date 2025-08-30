// components/DetailedView.js
import React from "react";
import TopBar from "./Topbar";
import Footer from "./Footer";
import AppointmentDetails, { AppointmentSidebar } from "./AppointmentDetails";
import AppointmentActions from "./AppointmentActions";
import { BackIcon } from "../Icons/Icons";

const DetailedView = ({
  selectedAppointment,
  onBackToDashboard,
  onConfirmAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
}) => {
  if (!selectedAppointment) return null;

  const handleConfirm = () => {
    console.log("Confirming appointment:", selectedAppointment._id);
    onConfirmAppointment?.(selectedAppointment);
  };

  const handleReschedule = () => {
    console.log("Rescheduling appointment:", selectedAppointment._id);
    onRescheduleAppointment?.(selectedAppointment);
  };

  const handleCancel = () => {
    console.log("Cancelling appointment:", selectedAppointment._id);
    onCancelAppointment?.(selectedAppointment);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#161515] font-mono text-white">
      <TopBar selectedAppointment={selectedAppointment} />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3 py-2 bg-slate-500 border border-slate-700 text-black font-bold rounded-md hover:bg-slate-700 hover:border-slate-600 transition-all text-sm"
          >
            <BackIcon />
            Back to Appointments
          </button>
          <h1 className="text-2xl font-semibold">
            {selectedAppointment.doctor?.name || "Unassigned"} -{" "}
            {selectedAppointment.doctorProfile?.specialization || "N/A"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-tr from-slate-900 via-stone-900 to-gray-800 border border-slate-700 rounded-md p-6">
            <AppointmentDetails appointment={selectedAppointment} />

            <AppointmentActions
              onConfirm={handleConfirm}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
            />
          </div>

          <AppointmentSidebar appointment={selectedAppointment} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetailedView;
