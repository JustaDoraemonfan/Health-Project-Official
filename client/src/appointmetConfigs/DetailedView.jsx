// components/DetailedView.js
import React, { useState } from "react";
import TopBar from "./Topbar";
import Footer from "./Footer";
import AppointmentDetails, { AppointmentSidebar } from "./AppointmentDetails";
import AppointmentActions from "./AppointmentActions";
import { BackIcon } from "../Icons/Icons";

const DetailedView = ({
  selectedAppointment,
  onBackToDashboard,
  onRescheduleAppointment,
  onCancelAppointment,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  if (!selectedAppointment) return null;

  const handleReschedule = () => {
    console.log("Rescheduling appointment:", selectedAppointment._id);
    onRescheduleAppointment?.(selectedAppointment);
  };

  const handleCancel = () => {
    setShowCancelModal(true); // open modal instead of cancelling directly
  };

  const confirmCancel = () => {
    onCancelAppointment?.(selectedAppointment);
    setShowCancelModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#161515] google-sans-code-400 text-white">
      <TopBar selectedAppointment={selectedAppointment} />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 border border-slate-600 text-white font-medium rounded-lg hover:bg-slate-600 hover:border-slate-500 transition-all duration-200 text-sm"
          >
            <BackIcon />
            Back to Appointments
          </button>

          <div className="h-6 w-px bg-slate-600 mx-2"></div>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              {selectedAppointment.doctor?.name || "Unassigned"}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {selectedAppointment.doctorProfile?.specialization || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-sm">
            <AppointmentDetails appointment={selectedAppointment} />

            {selectedAppointment.status === "cancelled" ? (
              <div className="mt-6 bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
                <span className="text-red-400 font-medium">
                  This appointment has been cancelled
                </span>
              </div>
            ) : (
              <div className="mt-6 pt-4 border-t border-slate-700">
                <AppointmentActions
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                />
              </div>
            )}
          </div>

          <AppointmentSidebar appointment={selectedAppointment} />
        </div>
      </main>

      {showCancelModal && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-200"
          style={{
            animation: showCancelModal
              ? "fadeIn 0.2s ease-out"
              : "fadeOut 0.2s ease-out",
          }}
        >
          <div
            className="bg-white text-black p-6 rounded-2xl shadow-2xl w-96 transform transition-all duration-200"
            style={{
              animation: showCancelModal
                ? "scaleIn 0.25s ease-out"
                : "scaleOut 0.25s ease-out",
            }}
          >
            <h3 className="text-xl text-red-600 font-bold mb-3">
              Confirm Cancellation
            </h3>
            <p className="mb-5 text-gray-700">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
        }
      `}</style>
    </div>
  );
};

export default DetailedView;
