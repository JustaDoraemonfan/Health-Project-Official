import {
  Calendar,
  Clock,
  FileText,
  User,
  Check,
  AlertCircle,
  MapPin,
  CreditCard,
  Info,
} from "lucide-react";
import { useEffect } from "react";

export const BookingSteps = ({
  currentStep,
  formData,
  errors,
  doctor,
  onChange,
  availability = [], // Availability from backend: [{ day: "Monday", slots: ["09:00-11:00", "14:00-16:00"] }]
}) => {
  // Helper function to get weekday name from date

  useEffect(() => {
    console.log("🔍 Availability received in BookingSteps:", availability);

    if (availability && Array.isArray(availability)) {
      availability.forEach((item, index) => {
        console.log(`➡️ Item ${index}:`, item);

        if (!item?.day) {
          console.warn(`⚠️ Missing 'day' field in availability[${index}]`);
        }

        if (!item?.slots) {
          console.warn(`⚠️ Missing 'slots' for day '${item?.day}'`);
        } else if (!Array.isArray(item.slots)) {
          console.warn(
            `⚠️ 'slots' is not an array for day '${item.day}':`,
            item.slots
          );
        }
      });
    } else {
      console.warn("⚠️ Availability is NOT an array:", availability);
    }
  }, [availability]);

  const getWeekdayFromDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekdays[date.getDay()];
  };

  // Helper function to generate time slots from availability ranges
  const generateTimeSlots = (slots) => {
    const timeSlots = [];

    slots.forEach((slot) => {
      const [start, end] = slot.split("-");
      const startHour = parseInt(start.split(":")[0]);
      const startMinute = parseInt(start.split(":")[1]);
      const endHour = parseInt(end.split(":")[0]);
      const endMinute = parseInt(end.split(":")[1]);

      // Generate 30-minute slots
      let currentHour = startHour;
      let currentMinute = startMinute;

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const timeString = `${currentHour
          .toString()
          .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
        timeSlots.push(timeString);

        currentMinute += 30;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour++;
        }
      }
    });

    return timeSlots;
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!formData.appointmentDate) return [];

    const weekday = getWeekdayFromDate(formData.appointmentDate);
    const dayAvailability = availability.find(
      (avail) => avail.day.toLowerCase() === weekday?.toLowerCase()
    );

    if (!dayAvailability) return [];

    return generateTimeSlots(dayAvailability.slots);
  };

  // Format time for display (12-hour format)
  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const renderStep1 = () => {
    const availableTimeSlots = getAvailableTimeSlots();
    const selectedWeekday = getWeekdayFromDate(formData.appointmentDate);

    return (
      <div className="space-y-6 spline-sans-mono-400">
        {/* Date Input */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-primary)] mb-2">
            Appointment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={(e) => {
              onChange(e);
              // Clear time selection when date changes
              if (formData.appointmentTime) {
                onChange({
                  target: {
                    name: "appointmentTime",
                    value: "",
                  },
                });
              }
            }}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-white placeholder-slate-400 text-sm transition-colors disabled:opacity-50 ${
              errors.appointmentDate
                ? "border-red-500 focus:border-red-400"
                : "border-gray-700 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
          />
          {errors.appointmentDate && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4" />
              {errors.appointmentDate}
            </div>
          )}
          {selectedWeekday && (
            <div className="flex items-center gap-2 mt-2 text-blue-400 text-xs">
              <Info className="w-4 h-4" />
              Selected date is a {selectedWeekday}
            </div>
          )}
        </div>

        {/* Time Slot Selection */}
        {formData.appointmentDate && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-primary)] mb-3">
              Available Time Slots *
            </label>

            {availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableTimeSlots.map((timeSlot) => (
                  <label key={timeSlot} className="cursor-pointer">
                    <input
                      type="radio"
                      name="appointmentTime"
                      value={timeSlot}
                      checked={formData.appointmentTime === timeSlot}
                      onChange={onChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 rounded-lg border text-center transition-all duration-200 hover:border-gray-600 ${
                        formData.appointmentTime === timeSlot
                          ? "border-[var(--color-secondary)] bg-[var(--color-primary)]/20 text-white"
                          : "border-gray-700 bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium text-xs">
                          {formatTime12Hour(timeSlot)}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">
                  No available time slots for {selectedWeekday}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Please select a different date
                </p>
              </div>
            )}

            {errors.appointmentTime && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4" />
                {errors.}
              </div>
            )}
          </div>
        )}

        {/* Reason for Visit */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-primary)] mb-2">
            Reason for Visit <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reasonForVisit"
            value={formData.reasonForVisit}
            onChange={onChange}
            rows={3}
            placeholder="Please describe your symptoms, concerns, or the purpose of this appointment..."
            className={`w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-white placeholder-slate-400 text-sm transition-colors disabled:opacity-50 ${
              errors.reasonForVisit
                ? "border-red-500 focus:border-red-400"
                : "border-gray-700 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
          />
          <div className="flex justify-between items-center mt-2">
            {errors.reasonForVisit ? (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4" />
                {errors.reasonForVisit}
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                Minimum 5 characters required
              </div>
            )}
            <div className="text-xs text-gray-400">
              {formData.reasonForVisit.length}/200
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="spline--mono-400 space-y-6">
      {/* Appointment Type */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-primary)] mb-3">
          Appointment Type
        </label>
        {/* UPDATED: grid-cols-1 sm:grid-cols-2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                onChange={onChange}
                className="sr-only"
              />
              <div
                className={`p-3 rounded-lg border transition-all duration-200 hover:border-gray-600 ${
                  formData.type === option.value
                    ? "border-green-600 bg-[var(--color-primary)]/20 text-white"
                    : "border-gray-700 bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                }`}
              >
                <div className="font-medium text-xs">{option.label}</div>
                <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-primary)] mb-3">
          Consultation Mode
        </label>
        {/* UPDATED: grid-cols-1 sm:grid-cols-2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="in-person"
              checked={formData.mode === "in-person"}
              onChange={onChange}
              className="sr-only"
            />
            <div
              className={`p-4 rounded-lg border transition-all duration-200 hover:border-gray-600 ${
                formData.mode === "in-person"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 bg-[var(--color-primary)]/5"
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
                        : "text-[var(--color-primary)]"
                    }`}
                  >
                    In-Person
                  </div>
                  <div className="text-xs text-gray-400">Visit clinic</div>
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
              onChange={onChange}
              className="sr-only"
            />
            <div
              className={`p-4 rounded-lg border transition-all duration-200 hover:border-gray-600 ${
                formData.mode === "online"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 bg-[var(--color-primary)]/5"
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
                        : "text-[var(--color-primary)]"
                    }`}
                  >
                    Online
                  </div>
                  <div className="text-xs text-gray-400">Video call</div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Location (for in-person) */}
      {formData.mode === "in-person" && (
        <div>
          <label className="block text-xs font-medium text-[var(--color-primary)] mb-2">
            Preferred Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="e.g., Main Clinic, Branch Office..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-white placeholder-slate-400 text-sm transition-colors disabled:opacity-50"
          />
          <div className="text-xs text-gray-400 mt-1">
            Leave empty to use default clinic location
          </div>
        </div>
      )}

      {/* Additional Notes */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-primary)] mb-2">
          Additional Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          rows={3}
          placeholder="Any additional information, medical history, or special requests..."
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-white placeholder-slate-400 text-sm transition-colors disabled:opacity-50"
        />
        <div className="text-xs text-gray-400 mt-1 text-right">
          {formData.notes.length}/500
        </div>
      </div>

      {/* Payment Reference */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-primary)] mb-2">
          Payment Reference
        </label>

        <div className="relative">
          <CreditCard className="absolute left-3 top-2 w-6 h-6 text-gray-400 pointer-events-none" />

          <select
            name="paymentReference"
            value={formData.paymentReference || ""}
            onChange={onChange}
            aria-label="Payment Reference"
            className="w-full pl-12 pr-3 py-3 bg-slate-800 border border-slate-600 rounded-md text-white text-xs"
          >
            <option value="" disabled>
              Select payment type
            </option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="net_banking">Net Banking</option>
          </select>
        </div>

        <div className="text-xs text-gray-400 mt-1">
          Optional: Add payment or insurance information
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="spline-sans-mono-400 space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="text-md font-semibold text-[var(--color-primary)] mb-1">
          Confirm Appointment
        </h3>
        <p className="text-xs text-gray-400">
          Please review your appointment details
        </p>
      </div>

      {/* Doctor Info */}
      <div className="bg-transparent rounded-xl p-4 ">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <div className="font-medium text-[var(--color-primary)]">
              {doctor.userId.name}
            </div>
            <div className="text-xs text-purple-400">
              {doctor.specialization}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-3">
        {/* UPDATED: flex-col sm:flex-row and margins */}
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400 text-xs mb-1 sm:mb-0">
            Date & Time
          </span>
          <span className="text-[var(--color-primary)] font-medium text-right">
            {new Date(formData.appointmentDate).toLocaleDateString()} at{" "}
            {formData.appointmentTime
              ? formatTime12Hour(formData.appointmentTime)
              : formData.appointmentTime}
          </span>
        </div>

        {/* UPDATED: flex-col sm:flex-row and margins */}
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400 text-xs mb-1 sm:mb-0">Type</span>
          <span className="text-[var(--color-primary)] text-xs capitalize">
            {formData.type}
          </span>
        </div>

        {/* UPDATED: flex-col sm:flex-row and margins */}
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400 text-xs mb-1 sm:mb-0">Mode</span>
          <span className="text-green-300 capitalize text-xs">
            {formData.mode}
          </span>
        </div>

        {/* UPDATED: flex-col sm:flex-row and margins */}
        {formData.location && (
          <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-800">
            <span className="text-gray-400 text-xs mb-1 sm:mb-0">Location</span>
            <span className="text-[var(--color-primary)] text-xs">
              {formData.location}
            </span>
          </div>
        )}

        <div className="py-2">
          <span className="text-gray-400 text-xs block mb-2">
            Reason for Visit
          </span>
          <div className="bg-[var(--color-primary)]/5 rounded-md p-3 border border-gray-700">
            <p className="text-[var(--color-primary)] text-xs leading-relaxed">
              {formData.reasonForVisit}
            </p>
          </div>
        </div>

        {formData.notes && (
          <div className="py-2">
            <span className="text-gray-400 text-xs block mb-2">
              Additional Notes
            </span>
            <div className="bg-[var(--color-primary)]/5 rounded-md p-3 border border-gray-700">
              <p className="text-[var(--color-primary)] text-xs leading-relaxed">
                {formData.notes}
              </p>
            </div>
          </div>
        )}

        {/* UPDATED: flex-col sm:flex-row and margins */}
        {formData.paymentReference && (
          <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-800">
            <span className="text-gray-400 text-xs mb-1 sm:mb-0">
              Payment Reference
            </span>
            <span className="text-[var(--color-primary)] font-mono text-xs">
              {formData.paymentReference}
            </span>
          </div>
        )}
      </div>

      {/* Confirmation Note */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-400 mt-0.5" />
          <div className="text-xs text-green-400">
            <p className="font-medium mb-1">Ready to book!</p>
            <p className="text-xs text-green-300/80">
              You will receive a confirmation email with appointment details and
              any pre-visit instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the appropriate step
  switch (currentStep) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    default:
      return renderStep1();
  }
};
