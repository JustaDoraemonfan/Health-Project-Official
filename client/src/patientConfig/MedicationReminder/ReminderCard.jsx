import React, { useEffect } from "react";
import { Clock, Check, Edit2, Calendar, Trash2 } from "lucide-react";
import {
  formatTime,
  formatDate,
  getReminderStatus,
  isMedicationEnded,
  getISTDateKey,
  getYesterdayIST,
  getTodayIST,
  normalizeToISTMidnight,
} from "../../utils/DateHelpers";

const ReminderCard = ({ reminder, onMarkAsTaken, onEdit, onDelete }) => {
  const todayKey = getISTDateKey(getTodayIST());
  const displayStatus = getReminderStatus(reminder);
  const isEnded = isMedicationEnded(reminder.endDate);

  // Enhanced missed logic - check all past dates that should be marked as missed
  useEffect(() => {
    if (!reminder.dailyStatus || isEnded) return;

    const today = getTodayIST();
    const startDate = normalizeToISTMidnight(reminder.startDate);
    const endDate = reminder.endDate
      ? normalizeToISTMidnight(reminder.endDate)
      : today;

    // Only check dates before today
    const checkUntil = new Date(
      Math.min(endDate.getTime(), today.getTime() - 86400000)
    ); // yesterday

    // Check each day from start to yesterday
    let currentDate = new Date(startDate);
    let hasChanges = false;

    while (currentDate <= checkUntil) {
      const dateKey = getISTDateKey(currentDate);

      // If status is "upcoming" or undefined for a past date, it should be "missed"
      if (
        !reminder.dailyStatus[dateKey] ||
        reminder.dailyStatus[dateKey] === "upcoming"
      ) {
        // Don't mutate directly - this would need to trigger a backend update
        console.log(
          `Date ${dateKey} should be marked as missed for ${reminder.medicine}`
        );
        hasChanges = true;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // If there are changes needed, you should call the backend to update
    // For now, we're just logging - ideally add an onMarkAsMissed callback
  }, [reminder, isEnded]);

  const getStatusColor = () => {
    if (isEnded) return "text-gray-500";
    switch (displayStatus) {
      case "taken":
        return "text-green-400 bg-transparent";
      case "missed":
        return "text-red-600 bg-transparent";
      case "today":
        return "text-yellow-600 bg-transparent";
      case "upcoming":
        return "text-blue-600 bg-transparent";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = () => {
    if (isEnded) return "Medication Ended";

    const today = getTodayIST();
    const startDate = normalizeToISTMidnight(reminder.startDate);

    // If medication hasn't started yet
    if (today < startDate) {
      return `Starts ${formatDate(startDate)}`;
    }

    switch (displayStatus) {
      case "taken":
        return `✓ Taken today`;
      case "missed":
        return "Missed";
      case "today":
        return "Due today";
      case "upcoming":
        return "Upcoming";
      default:
        return "Pending";
    }
  };

  // Determine if we should show action buttons
  const showActionButtons = () => {
    if (isEnded) return false;

    const today = getTodayIST();
    const startDate = normalizeToISTMidnight(reminder.startDate);
    const endDate = reminder.endDate
      ? normalizeToISTMidnight(reminder.endDate)
      : null;

    // Show buttons only if medication period is active
    return today >= startDate && (!endDate || today <= endDate);
  };

  // Check if "Mark as taken" button should be shown
  const canMarkAsTaken = () => {
    return displayStatus !== "taken" && showActionButtons();
  };

  return (
    <div className="bg-[var(--color-secondary)]/90 rounded-lg shadow-sm border border-black/10 p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-[var(--color-primary)]">
            {reminder.medicine}
          </h3>
          {reminder.dosage && (
            <p className="text-green-400 text-sm">{reminder.dosage}</p>
          )}

          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center text-white">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {reminder.displayDate
                  ? formatDate(reminder.displayDate)
                  : reminder.endDate
                  ? `${formatDate(reminder.startDate)} - ${formatDate(
                      reminder.endDate
                    )}`
                  : `From ${formatDate(reminder.startDate)}`}
              </span>
            </div>
          </div>

          {reminder.times?.length > 0 && (
            <div className="flex items-center text-slate-300 mt-2">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {reminder.times.map((t, i) => (
                  <span key={i}>
                    {formatTime(t)}
                    {i < reminder.times.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            </div>
          )}

          {reminder.frequency && (
            <p className="text-xs text-orange-500 mt-1">
              Repeat: {reminder.frequency}
            </p>
          )}

          {/* Show streak or missed count */}
          {reminder.dailyStatus &&
            Object.keys(reminder.dailyStatus).length > 0 && (
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-green-400">
                  ✓{" "}
                  {
                    Object.values(reminder.dailyStatus).filter(
                      (s) => s === "taken"
                    ).length
                  }{" "}
                  taken
                </span>
                <span className="text-red-400">
                  ✗{" "}
                  {
                    Object.values(reminder.dailyStatus).filter(
                      (s) => s === "missed"
                    ).length
                  }{" "}
                  missed
                </span>
              </div>
            )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-2 py-1 rounded-full text-sm font-light ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>

          {/* Action buttons */}
          {showActionButtons() && (
            <div className="flex items-center space-x-2">
              {canMarkAsTaken() && (
                <button
                  onClick={() => onMarkAsTaken(reminder._id)}
                  className="group p-2.5 text-emerald-600 hover:text-white hover:bg-emerald-600 bg-emerald-50 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 shadow-sm hover:shadow-md"
                  title="Mark as taken"
                >
                  <Check className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
                </button>
              )}
              <button
                onClick={() => onEdit(reminder)}
                className="group p-2.5 text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 shadow-sm hover:shadow-md"
                title="Edit reminder"
              >
                <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
              </button>
              <button
                onClick={() => onDelete(reminder._id)}
                className="group p-2.5 text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 shadow-sm hover:shadow-md"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
