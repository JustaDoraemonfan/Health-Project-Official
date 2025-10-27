// components/DetailedView.js
import React, { useState, useEffect } from "react";
import TopBar from "./Topbar";
import Footer from "./Footer";
import AppointmentDetails, { AppointmentSidebar } from "./AppointmentDetails";
import AppointmentActions from "./AppointmentActions";
import { BackIcon } from "../../Icons/Icons";
import { doctorAPI } from "../../services/api";

const cancellationReasons = [
  "Schedule conflict",
  "Personal emergency",
  "Feeling unwell",
  "Transportation issues",
  "No longer need appointment",
  "Other",
];

const DetailedView = ({
  selectedAppointment,
  userName,
  onBackToDashboard,
  onRescheduleAppointment,
  onCancelAppointment,
  // You might want to add a prop for handling completion
  // onCompleteAppointment,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  // New state for the "Done" modal
  const [showDoneModal, setShowDoneModal] = useState(false);

  useEffect(() => {
    if (!showCancelModal) {
      setReason("");
      setSelectedCategory("");
    }
  }, [showCancelModal]);
  const [reason, setReason] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  if (!selectedAppointment) return null;

  const handleSubmit = () => {
    const finalReason =
      selectedCategory === "Other" || !selectedCategory
        ? reason
        : selectedCategory + (reason ? `: ${reason}` : "");

    confirmCancel(finalReason);
  };

  const isSubmitDisabled = () => {
    if (selectedCategory && selectedCategory !== "Other") {
      return false; // Category selected, no additional text required
    }
    return !reason.trim(); // Require text input for "Other" or when no category selected
  };

  const handleReschedule = () => {
    console.log("Rescheduling appointment:", selectedAppointment._id);
    onRescheduleAppointment?.(selectedAppointment);
  };

  const handleCancel = () => {
    setShowCancelModal(true); // open modal instead of cancelling directly
  };

  const confirmCancel = (cancellationReason) => {
    console.log("Appointment cancelled with reason:", cancellationReason);
    onCancelAppointment?.(selectedAppointment, cancellationReason);
    setShowCancelModal(false);
  };

  // New handler for completing the appointment
  const handleCompleteAppointment = async () => {
    console.log("Unassigning doctor for appointment:", selectedAppointment);
    console.log(
      selectedAppointment.doctor._id,
      selectedAppointment.patient._id
    );
    await doctorAPI.unassignPatient(
      selectedAppointment.doctor._id,
      selectedAppointment.patient._id
    );
    // onCompleteAppointment?.(selectedAppointment); // Call prop if it exists
    setShowDoneModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary)] google-sans-code-400 text-white">
      {/* UPDATED: Responsive padding */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* UPDATED: Stacks on mobile, row on sm+ screens */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <button
            onClick={onBackToDashboard}
            className="flex self-start items-center gap-2 px-4 py-2.5 bg-slate-700 border border-slate-600 text-white font-medium rounded-lg hover:bg-slate-600 hover:border-slate-500 transition-all duration-200 text-sm"
          >
            <BackIcon />
            Back to Appointments
          </button>

          <div className="hidden sm:block h-6 w-px bg-slate-600 mx-2"></div>

          <div>
            <h1 className="text-2xl font-light text-[var(--color-secondary)]">
              {selectedAppointment.doctor?.name || "Unassigned"}
            </h1>
            <p className="text-[var(--color-secondary)]/60 text-sm mt-0.5">
              {selectedAppointment.doctorProfile?.specialization || "N/A"}
            </p>
          </div>
        </div>

        {/* This grid is already responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--color-secondary)]/90 border border-slate-700 rounded-lg p-6 shadow-sm">
            <AppointmentDetails appointment={selectedAppointment} />

            {selectedAppointment.status.startsWith("cancelled") ? (
              <div className="mt-6 bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
                <span className="text-red-400 font-medium">
                  This appointment has been cancelled
                </span>
              </div>
            ) : (
              // MODIFIED: Added flex layout to this div to contain actions and new button
              <div className="mt-6 pt-4 border-t border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
                <AppointmentActions
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                />

                {/* NEW BUTTON ADDED HERE */}
                <button
                  onClick={() => setShowDoneModal(true)}
                  className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 text-sm whitespace-nowrap"
                >
                  Done with appointment?
                </button>
              </div>
            )}
          </div>
          {selectedAppointment.status.startsWith("cancelled") ? (
            <div className="bg-[var(--color-secondary)] border border-slate-700 rounded-lg p-6 h-fit space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">
                  Cancellation Details
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-sm">Reason</span>
                    <span className="text-white text-sm bg-slate-700/50 p-2 rounded break-words">
                      {selectedAppointment.cancellationDetails
                        ?.cancellationReason || "No reason provided"}
                    </span>
                  </div>
                  {selectedAppointment.cancellationDetails?.cancelledAt && (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-slate-400 text-sm">
                        Cancelled At
                      </span>
                      <span className="text-white text-sm text-right">
                        {new Date(
                          selectedAppointment.cancellationDetails.cancelledAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedAppointment.cancellationDetails?.cancelledBy && (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-slate-400 text-sm">
                        Cancelled By
                      </span>
                      <span className="text-white text-sm text-right capitalize">
                        {selectedAppointment.cancellationDetails.cancelledBy}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Information (still relevant for cancelled appointments) */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-white font-semibold mb-4">
                  Patient Information
                </h3>
                <div className="space-y-3">
                  {/* UPDATED: Removed max-width for better wrapping */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 text-sm block">
                        Email
                      </span>
                      <span className="text-white text-sm break-all">
                        {selectedAppointment.patient?.email || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm block">Name</span>
                      <span className="text-white text-sm break-words">
                        {selectedAppointment.patient?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AppointmentSidebar
              appointment={selectedAppointment}
              userName={userName}
            />
          )}
        </div>
      </main>

      {showCancelModal && (
        <>
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
                transform: scale(0.9);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            @keyframes scaleOut {
              from {
                transform: scale(1);
                opacity: 1;
              }
              to {
                transform: scale(0.9);
                opacity: 0;
              }
            }
          `}</style>

          <div
            className="fixed inset-0 bg-[var(--color-secondary)]/80 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-200 p-4"
            style={{
              animation: showCancelModal
                ? "fadeIn 0.2s ease-out"
                : "fadeOut 0.2s ease-out",
            }}
          >
            <div
              className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
              style={{
                animation: showCancelModal
                  ? "scaleIn 0.25s ease-out"
                  : "scaleOut 0.25s ease-out",
              }}
            >
              <h3 className="text-xl text-red-600 font-light mb-3">
                Cancel Appointment
              </h3>
              <p className="mb-5 text-sm text-gray-700">
                Please provide a reason for canceling this appointment. This
                action cannot be undone.
              </p>

              {/* Reason Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation
                </label>

                {/* Dropdown for common reasons */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                >
                  <option value="">Select a reason...</option>
                  {cancellationReasons.map((reasonOption) => (
                    <option key={reasonOption} value={reasonOption}>
                      {reasonOption}
                    </option>
                  ))}
                </select>

                {/* Text area for additional details or "Other" reason */}
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    selectedCategory === "Other"
                      ? "Please specify..."
                      : "Additional details (optional)"
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled()}
                  className={`px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${
                    isSubmitDisabled()
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* NEW MODAL FOR "DONE" BUTTON */}
      {showDoneModal && (
        <>
          {/* Re-using modal styles */}
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
                transform: scale(0.9);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            @keyframes scaleOut {
              from {
                transform: scale(1);
                opacity: 1;
              }
              to {
                transform: scale(0.9);
                opacity: 0;
              }
            }
          `}</style>
          <div
            className="fixed inset-0 bg-[var(--color-secondary)]/80 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-200 p-4"
            style={{
              animation: showDoneModal
                ? "fadeIn 0.2s ease-out"
                : "fadeOut 0.2s ease-out",
            }}
            // Close on backdrop click
            onClick={() => setShowDoneModal(false)}
          >
            <div
              className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
              style={{
                animation: showDoneModal
                  ? "scaleIn 0.25s ease-out"
                  : "scaleOut 0.25s ease-out",
              }}
              // Prevent modal from closing when clicking inside it
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl text-green-700 font-light mb-3">
                Appointment Complete
              </h3>
              <p className="mb-5 text-sm text-gray-700">
                Thanks! We are unassigning the doctor.
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCompleteAppointment} // Using the new handler
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>
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
