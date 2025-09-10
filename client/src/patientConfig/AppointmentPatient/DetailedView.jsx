// components/DetailedView.js
import React, { useState, useEffect } from "react";
import TopBar from "./Topbar";
import Footer from "./Footer";
import AppointmentDetails, { AppointmentSidebar } from "./AppointmentDetails";
import AppointmentActions from "./AppointmentActions";
import { BackIcon } from "../../Icons/Icons";
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
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
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
    onCancelAppointment?.(selectedAppointment);
    setShowCancelModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary)] google-sans-code-400 text-white">
      <TopBar selectedAppointment={selectedAppointment} userName={userName} />

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
            <h1 className="text-2xl font-light text-[var(--color-secondary)]">
              {selectedAppointment.doctor?.name || "Unassigned"}
            </h1>
            <p className="text-[var(--color-secondary)]/60 text-sm mt-0.5">
              {selectedAppointment.doctorProfile?.specialization || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--color-secondary)]/90 border border-slate-700 rounded-lg p-6 shadow-sm">
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
            className="fixed inset-0 bg-[var(--color-secondary)]/80 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-200"
            style={{
              animation: showCancelModal
                ? "fadeIn 0.2s ease-out"
                : "fadeOut 0.2s ease-out",
            }}
          >
            <div
              className="bg-white text-black p-6 rounded-2xl shadow-2xl w-96 max-w-md mx-4 transform transition-all duration-200"
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
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
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
