import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { BookingSteps } from "./BookingSteps";
import ResultModal from "./ResultModal";
import { useNavigate } from "react-router-dom";
const BookingModal = ({ doctor, onClose, onConfirm }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // New states for loading and confirmation
  const [isBooking, setIsBooking] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [bookingResult, setBookingResult] = useState(null); // { success: boolean, appointmentId?: string, message?: string }

  const loadingMessages = [
    "Checking doctor availability…",
    "Confirming appointment…",
    "Generating appointment ID…",
    "Finalizing your booking…",
  ];

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setAvailability(doctor.availability || []);
      } catch (error) {
        console.error("Error fetching availability:", error);

        // Fallback availability for demo purposes
        setAvailability([
          { day: "Monday", slots: ["09:00-11:00", "14:00-16:00"] },
          { day: "Tuesday", slots: ["10:00-12:00", "15:00-17:00"] },
          { day: "Wednesday", slots: ["10:00-13:00"] },
          { day: "Thursday", slots: ["09:00-11:30", "13:30-16:00"] },
          { day: "Friday", slots: ["09:00-11:30", "13:00-16:00"] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (doctor?._id) {
      fetchAvailability();
    }
  }, [doctor?._id]);

  // Rotate loading messages every 800ms
  useEffect(() => {
    if (!isBooking) return;

    let messageIndex = 0;
    setLoadingMessage(loadingMessages[0]);

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 800);

    return () => clearInterval(interval);
  }, [isBooking]);

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
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);

    try {
      const payload = {
        ...formData,
        doctor: doctor.userId._id,
      };

      // Call the confirmation handler
      const result = await onConfirm(payload);

      // Check the actual response structure
      if (result?.success || result?.data?.success) {
        setBookingResult({
          success: true,
          appointmentId:
            result?.appointmentId ||
            result?.data?.appointmentId ||
            `APT-${Date.now()}`,
          message:
            result?.message ||
            result?.data?.message ||
            "Appointment booked successfully!",
        });
      } else {
        setBookingResult({
          success: false,
          message:
            result?.message ||
            result?.data?.message ||
            "Failed to book appointment. Please try again.",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingResult({
        success: false,
        message:
          error.message || "Failed to book appointment. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleGoToUpcoming = () => {
    navigate("/patient/appointment");
  };

  const handleCloseResult = () => {
    setBookingResult(null);
    onClose();
  };

  // Show loading state while fetching availability
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--color-primary)] rounded-2xl shadow-2xl w-full max-w-lg border border-slate-400 p-6 sm:p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-[var(--color-secondary)] mb-2">
              Loading Available Slots
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Please wait while we fetch the doctor's availability...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show booking loading screen
  if (isBooking) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 p-8">
          <div className="text-center">
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />
              <div className="absolute inset-0 animate-pulse">
                <Loader2 className="w-16 h-16 text-blue-300 opacity-30 mx-auto" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Processing Your Booking
            </h3>
            <p className="text-sm text-gray-300 animate-pulse min-h-[20px]">
              {loadingMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show result modal (success or error)
  if (bookingResult) {
    return (
      <ResultModal
        type={bookingResult.success ? "success" : "error"}
        bookingResult={bookingResult}
        doctor={doctor}
        formData={formData}
        onTryAgain={() => setBookingResult(null)}
        onClose={handleCloseResult}
        onGoToUpcoming={handleGoToUpcoming}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-[var(--color-secondary)] rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg border border-slate-400 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex justify-between items-start sm:items-center gap-2">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
                Book Appointment
              </h2>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    currentStep >= 1 ? "bg-green-300" : "bg-gray-600"
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    currentStep >= 2 ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    currentStep >= 3 ? "bg-green-700" : "bg-gray-600"
                  }`}
                />
                <span className="text-xs text-gray-200 ml-1 sm:ml-2">
                  Step {currentStep} of 3
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 p-1.5 sm:p-2 rounded-lg hover:bg-gray-800/50 transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 p-4 sm:p-6 overflow-y-auto"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <BookingSteps
            currentStep={currentStep}
            formData={formData}
            errors={errors}
            doctor={doctor}
            onChange={handleChange}
            availability={availability}
          />
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-800 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-[var(--color-secondary)] text-[var(--color-primary)] hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-700 hover:border-gray-600 text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            <div className="hidden sm:block sm:flex-1" />

            {currentStep === 1 && (
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-black rounded-lg font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/25 text-sm sm:text-base w-full sm:w-auto"
              >
                Review
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-green-600/25 text-sm sm:text-base w-full sm:w-auto"
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
