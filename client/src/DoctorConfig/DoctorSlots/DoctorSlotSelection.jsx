import React, { useState } from "react";
import { doctorAPI } from "../../services/api";
import Toast from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const DoctorSlotSelection = ({
  onSave = (data) => console.log("Formatted availability:", data),
}) => {
  const navigate = useNavigate();
  // Generate time slots from 9:00 AM to 6:00 PM in 1-hour intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time12 =
        hour > 12
          ? `${hour - 12}:00 PM`
          : hour === 12
          ? `12:00 PM`
          : `${hour}:00 AM`;
      const time24 = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({ display: time12, value: time24 });
    }
    return slots;
  };

  const days = [
    { short: "Mon", full: "Monday", key: "monday" },
    { short: "Tue", full: "Tuesday", key: "tuesday" },
    { short: "Wed", full: "Wednesday", key: "wednesday" },
    { short: "Thu", full: "Thursday", key: "thursday" },
    { short: "Fri", full: "Friday", key: "friday" },
    { short: "Sat", full: "Saturday", key: "saturday" },
    { short: "Sun", full: "Sunday", key: "sunday" },
  ];

  const timeSlots = generateTimeSlots();

  // State management
  const [selectedSlots, setSelectedSlots] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [toast, setToast] = useState(null);

  const toggleSlot = (dayKey, timeValue) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [timeValue]: !prev[dayKey]?.[timeValue],
      },
    }));
  };

  const isSlotSelected = (dayKey, timeValue) => {
    return selectedSlots[dayKey]?.[timeValue] || false;
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  const getDaySlotCount = (dayKey) => {
    return Object.values(selectedSlots[dayKey] || {}).filter(Boolean).length;
  };

  // Helper function to convert time slots to ranges
  const convertToTimeRanges = (timeSlots) => {
    if (!timeSlots.length) return [];

    // Sort time slots
    const sortedSlots = timeSlots.sort();
    const ranges = [];
    let rangeStart = sortedSlots[0];
    let rangeEnd = sortedSlots[0];

    for (let i = 1; i < sortedSlots.length; i++) {
      const currentSlot = sortedSlots[i];
      const currentHour = parseInt(currentSlot.split(":")[0]);
      const rangeEndHour = parseInt(rangeEnd.split(":")[0]);

      // Check if current slot is consecutive to the range end
      if (currentHour === rangeEndHour + 1) {
        rangeEnd = currentSlot;
      } else {
        // End current range and start a new one
        const endTime =
          String(parseInt(rangeEnd.split(":")[0]) + 1).padStart(2, "0") + ":00";
        ranges.push(`${rangeStart}-${endTime}`);
        rangeStart = currentSlot;
        rangeEnd = currentSlot;
      }
    }

    // Add the last range
    const endTime =
      String(parseInt(rangeEnd.split(":")[0]) + 1).padStart(2, "0") + ":00";
    ranges.push(`${rangeStart}-${endTime}`);

    return ranges;
  };

  const handleSave = async () => {
    const availability = [];

    // Process each day
    Object.keys(selectedSlots).forEach((dayKey) => {
      const daySlots = Object.keys(selectedSlots[dayKey]).filter(
        (timeValue) => selectedSlots[dayKey][timeValue]
      );

      if (daySlots.length > 0) {
        // Find the corresponding day name
        const dayName = days.find((d) => d.key === dayKey)?.full;

        if (dayName) {
          // Convert individual time slots to ranges
          const timeRanges = convertToTimeRanges(daySlots);

          availability.push({
            day: dayName,
            slots: timeRanges,
          });
        }
      }
    });

    // Format the final data structure
    const formattedData = {
      availability: availability,
    };

    onSave(formattedData);
    const result = await doctorAPI.setAvailability(availability);
    if (result?.success || result?.data?.success) {
      showToast(
        result?.message ||
          result?.data?.message ||
          "Slot Alloted Successfully!",
        "success"
      );
    } else {
      showToast("Failed to allot Slots", "error");
    }
    setTimeout(() => {
      navigate("/doctor/dashboard");
    }, 1000);
  };

  const getTotalSelectedSlots = () => {
    return Object.values(selectedSlots).reduce((total, daySlots) => {
      return total + Object.values(daySlots).filter(Boolean).length;
    }, 0);
  };

  const handleDayClick = (dayKey) => {
    setActiveDay(activeDay === dayKey ? null : dayKey);
  };

  return (
    <>
      <Header isNotDashboard={true} />
      <div
        className="min-h-screen p-4 sm:p-6 py-20 "
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-secondary)",
          fontFamily: '"Google Sans Code", monospace',
        }}
      >
        <div className="max-w-4xl mx-auto pt-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-normal mb-2">
              Set Your Availability
            </h1>
            <p className="text-md sm:text-sm opacity-70">
              Click on a day to set your available time slots
            </p>
          </div>

          {/* Days of Week Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3 mb-8">
            {days.map((day) => {
              const slotCount = getDaySlotCount(day.key);
              const isActive = activeDay === day.key;

              return (
                <button
                  key={day.key}
                  onClick={() => handleDayClick(day.key)}
                  className={`
                  p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-center
                  ${
                    isActive
                      ? "border-gray-800 bg-gray-800 text-white shadow-lg"
                      : slotCount > 0
                      ? "border-gray-400 bg-white hover:border-gray-600"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  }
                `}
                >
                  <div className="text-base sm:text-lg font-medium mb-1">
                    {day.short}
                  </div>
                  <div
                    className={`text-xs ${
                      isActive ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {day.full}
                  </div>
                  {slotCount > 0 && (
                    <div
                      className={`text-xs mt-2 px-2 py-1 rounded-full ${
                        isActive
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {slotCount} slot{slotCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Slots Panel */}
          {activeDay && (
            <div className="mb-8 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg sm:text-xl font-medium mb-4">
                {days.find((d) => d.key === activeDay)?.full} Time Slots
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={`${activeDay}-${slot.value}`}
                    onClick={() => toggleSlot(activeDay, slot.value)}
                    className={`
                    py-3 px-4 text-sm border transition-all duration-200 rounded
                    ${
                      isSlotSelected(activeDay, slot.value)
                        ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                        : "bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                    }
                  `}
                  >
                    {slot.display}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="text-xs sm:text-sm text-gray-600">
                    {getDaySlotCount(activeDay)} slots selected for{" "}
                    {days.find((d) => d.key === activeDay)?.full}
                  </div>
                  <button
                    onClick={() => setActiveDay(null)}
                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors self-end sm:self-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Summary and Save */}
          <div className="border-t border-gray-300 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-xs sm:text-sm opacity-70">
                {getTotalSelectedSlots()} total slots selected across the week
              </div>

              <button
                onClick={handleSave}
                className="
                w-full sm:w-auto px-6 py-3 bg-gray-800 text-white text-sm font-medium 
                rounded hover:bg-gray-700 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
                disabled={getTotalSelectedSlots() === 0}
              >
                Save Availability
              </button>
            </div>
          </div>

          {/* Instructions */}
          {!activeDay && (
            <div className="mt-6 p-4 bg-gray-50 rounded text-xs opacity-70">
              <p className="mb-2">
                <strong>How to set your availability:</strong>
              </p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Click on a day of the week to open the time slot panel</li>
                <li>Select your available time slots for that day</li>
                <li>
                  Consecutive slots will be automatically grouped into ranges
                </li>
                <li>Click "Save Availability" when finished</li>
              </ol>
            </div>
          )}
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </div>
    </>
  );
};
export default DoctorSlotSelection;
