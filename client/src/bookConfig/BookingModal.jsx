import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  FileText,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  MapPin,
  CreditCard,
  MessageSquare,
} from "lucide-react";

const BookingModal = ({ doctor, onClose, onConfirm }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Required fields
    appointmentDate: "",
    appointmentTime: "",
    reasonForVisit: "",

    // Optional fields with defaults
    type: "consultation",
    mode: "in-person",
    notes: "",
    location: "",
    paymentReference: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Date is required";
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointmentDate = "Date must be in the future";
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Time is required";
    }

    if (!formData.reasonForVisit || formData.reasonForVisit.trim().length < 5) {
      newErrors.reasonForVisit =
        "Please provide at least 5 characters describing your concern";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      doctor: doctor.userId._id,
      doctorProfile: doctor._id,
    };

    onConfirm(payload);
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-100 mb-1">
          Schedule Appointment
        </h3>
        <p className="text-sm text-gray-400">
          Choose your preferred date and time
        </p>
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Appointment Date *
        </label>
        <input
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className={`w-full p-3 rounded-lg bg-gray-800 text-gray-100 border transition-colors ${
            errors.appointmentDate
              ? "border-red-500 focus:border-red-400"
              : "border-gray-700 focus:border-blue-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
        />
        {errors.appointmentDate && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.appointmentDate}
          </div>
        )}
      </div>

      {/* Time Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Appointment Time *
        </label>
        <input
          type="time"
          name="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleChange}
          className={`w-full p-3 rounded-lg bg-gray-800 text-gray-100 border transition-colors ${
            errors.appointmentTime
              ? "border-red-500 focus:border-red-400"
              : "border-gray-700 focus:border-blue-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
        />
        {errors.appointmentTime && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.appointmentTime}
          </div>
        )}
      </div>

      {/* Reason for Visit */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Reason for Visit *
        </label>
        <textarea
          name="reasonForVisit"
          value={formData.reasonForVisit}
          onChange={handleChange}
          rows={4}
          placeholder="Please describe your symptoms, concerns, or the purpose of this appointment..."
          className={`w-full p-3 rounded-lg bg-gray-800 text-gray-100 border transition-colors resize-none ${
            errors.reasonForVisit
              ? "border-red-500 focus:border-red-400"
              : "border-gray-700 focus:border-blue-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
        />
        <div className="flex justify-between items-center mt-2">
          {errors.reasonForVisit ? (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.reasonForVisit}
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              Minimum 5 characters required
            </div>
          )}
          <div className="text-xs text-gray-500">
            {formData.reasonForVisit.length}/200
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-100 mb-1">
          Additional Details
        </h3>
        <p className="text-sm text-gray-400">
          Optional information to help prepare for your appointment
        </p>
      </div>

      {/* Appointment Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Appointment Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: "consultation",
              label: "Consultation",
              desc: "Initial visit or new concern",
            },
            { value: "follow-up", label: "Follow-up", desc: "Continuing care" },
            {
              value: "check-up",
              label: "Check-up",
              desc: "Routine examination",
            },
            {
              value: "emergency",
              label: "Emergency",
              desc: "Urgent medical need",
            },
          ].map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={formData.type === option.value}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  formData.type === option.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                }`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Consultation Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="in-person"
              checked={formData.mode === "in-person"}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`p-4 rounded-lg border transition-all duration-200 ${
                formData.mode === "in-person"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin
                  className={`w-5 h-5 ${
                    formData.mode === "in-person"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                />
                <div>
                  <div
                    className={`font-medium ${
                      formData.mode === "in-person"
                        ? "text-blue-300"
                        : "text-gray-300"
                    }`}
                  >
                    In-Person
                  </div>
                  <div className="text-xs text-gray-500">Visit clinic</div>
                </div>
              </div>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="online"
              checked={formData.mode === "online"}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`p-4 rounded-lg border transition-all duration-200 ${
                formData.mode === "online"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <User
                  className={`w-5 h-5 ${
                    formData.mode === "online"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                />
                <div>
                  <div
                    className={`font-medium ${
                      formData.mode === "online"
                        ? "text-blue-300"
                        : "text-gray-300"
                    }`}
                  >
                    Online
                  </div>
                  <div className="text-xs text-gray-500">Video call</div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Location (for in-person) */}
      {formData.mode === "in-person" && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Preferred Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Main Clinic, Branch Office..."
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
          />
          <div className="text-xs text-gray-500 mt-1">
            Leave empty to use default clinic location
          </div>
        </div>
      )}

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Additional Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional information, medical history, or special requests..."
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors resize-none"
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {formData.notes.length}/500
        </div>
      </div>

      {/* Payment Reference */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Payment Reference
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="paymentReference"
            value={formData.paymentReference}
            onChange={handleChange}
            placeholder="Insurance ID, payment confirmation, etc."
            className="w-full pl-10 p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Optional: Add payment or insurance information
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-100 mb-1">
          Confirm Appointment
        </h3>
        <p className="text-sm text-gray-400">
          Please review your appointment details
        </p>
      </div>

      {/* Doctor Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-gray-100">{doctor.name}</div>
            <div className="text-sm text-gray-400">{doctor.specialization}</div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Date & Time</span>
          <span className="text-gray-100 font-medium">
            {new Date(formData.appointmentDate).toLocaleDateString()} at{" "}
            {formData.appointmentTime}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Type</span>
          <span className="text-gray-100 capitalize">{formData.type}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Mode</span>
          <span className="text-gray-100 capitalize">{formData.mode}</span>
        </div>

        {formData.location && (
          <div className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-gray-400">Location</span>
            <span className="text-gray-100">{formData.location}</span>
          </div>
        )}

        <div className="py-2">
          <span className="text-gray-400 block mb-2">Reason for Visit</span>
          <div className="bg-gray-800/30 rounded-md p-3 border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed">
              {formData.reasonForVisit}
            </p>
          </div>
        </div>

        {formData.notes && (
          <div className="py-2">
            <span className="text-gray-400 block mb-2">Additional Notes</span>
            <div className="bg-gray-800/30 rounded-md p-3 border border-gray-700">
              <p className="text-gray-300 text-sm leading-relaxed">
                {formData.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">
                Book Appointment
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentStep >= 1 ? "bg-blue-500" : "bg-gray-600"
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentStep >= 2 ? "bg-blue-500" : "bg-gray-600"
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentStep >= 3 ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
                <span className="text-xs text-gray-500 ml-2">
                  Step {currentStep} of 3
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 p-1 rounded-md hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderSummary()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={
                  currentStep === 3
                    ? handleBack
                    : () => setCurrentStep(currentStep - 1)
                }
                className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            <div className="flex-1" />

            {currentStep === 1 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Review
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                Confirm Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
