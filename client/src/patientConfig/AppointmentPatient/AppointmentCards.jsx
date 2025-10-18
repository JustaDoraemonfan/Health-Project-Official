// components/AppointmentCard.js
import React, { useState } from "react";
import { Trash2, X } from "lucide-react";
import { DoctorIcon, CalendarIcon, ClockIcon } from "../../Icons/Icons";
import { getStatusClass, formatDate } from "../../utils/appointmentUtils";
import { appointmentAPI } from "../../services/api";

const AppointmentCard = ({ appointment, onCardClick }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await appointmentAPI.deleteAppointment(appointment._id);
      setShowDeleteModal(false);
      // Optionally trigger a refresh of the parent component
      window.location.reload();
    } catch (error) {
      console.error("Error while deleting the appointment", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className="bg-[var(--color-secondary)] border google-sans-code-400 border-slate-700 rounded-md p-4 cursor-pointer hover:border-slate-600 relative flex flex-col justify-between"
        onClick={() => onCardClick(appointment._id)}
      >
        <div>
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <DoctorIcon />
              <div className="text-white font-medium break-words">
                {appointment.doctor?.name || "Unassigned"} •{" "}
                <span className="text-amber-200 text-sm font-light">
                  {appointment.doctorProfile.specialization}
                </span>
              </div>
            </div>
          </div>

          {/* UPDATED: Added flex-wrap for very small screens */}
          <div className="flex flex-wrap items-center font-light gap-x-4 gap-y-2 mb-3 text-slate-100 text-sm">
            <div className="flex items-center gap-1">
              <CalendarIcon />
              {formatDate(appointment.appointmentDate)}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon />
              {appointment.appointmentTime}
            </div>
          </div>
        </div>
        {/* UPDATED: Stacks on mobile, row on sm+ */}
        <div className="flex justify-between flex-row sm:flex-row sm:justify-between sm:items-center gap-3 mt-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-light border self-start ${getStatusClass(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
          <button
            onClick={handleDeleteClick}
            className="group p-2.5 hover:cursor-pointer text-red-300 hover:text-white hover:bg-red-600  rounded-xl transition-all duration-200 ease-in-out shadow-sm hover:shadow-md self-start sm:self-center"
            title="Delete appointment"
          >
            <Trash2 className="w-4 h-4 duration-150" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Appointment
              </h3>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this appointment?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  {appointment.doctor?.name || "Unassigned"} -{" "}
                  {appointment.doctorProfile.specialization}
                </div>
                <div className="text-gray-600">
                  {formatDate(appointment.appointmentDate)} at{" "}
                  {appointment.appointmentTime}
                </div>
              </div>
              <p className="text-red-600 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>

            {/* UPDATED: Stacks on mobile, row on sm+ */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-300 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentCard;
