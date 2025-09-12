import React from "react";
import { Clock, Check, Edit2, Calendar, Trash2 } from "lucide-react";

const formatTime = (time) => {
  if (!time) return "—";

  const [hoursStr, minutes] = time.split(":");
  const hours = parseInt(hoursStr, 10);
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  return `${hour12}:${minutes} ${ampm}`;
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const ReminderCard = ({ reminder, onMarkAsTaken, onEdit, onDelete }) => {
  const getStatusColor = () => {
    if (reminder.status === "taken") return "text-green-600 bg-green-50";
    if (reminder.status === "missed") return "text-red-600 bg-red-50";
    if (reminder.status === "upcoming") return "text-blue-600 bg-blue-50";
    if (reminder.status === "today") return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getStatusText = () => {
    if (reminder.status === "taken") return "Taken";
    if (reminder.status === "missed") return "Missed";
    if (reminder.status === "upcoming") return "Upcoming";
    if (reminder.status === "today") return "Today";
    return "Pending";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-black/10 p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-black">
            {reminder.medicine}
          </h3>
          <p className="text-gray-600 text-sm">{reminder.dosage}</p>

          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {formatDate(reminder.startDate)}
                {reminder.endDate ? ` - ${formatDate(reminder.endDate)}` : ""}
              </span>
            </div>
          </div>

          {reminder.times && reminder.times.length > 0 && (
            <div className="flex items-center text-gray-700 mt-2">
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
            <p className="text-xs text-gray-500 mt-1">
              Repeat: {reminder.frequency}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
          <div className="flex space-x-1">
            {reminder.status === "upcoming" && (
              <button
                onClick={() => onMarkAsTaken(reminder._id)}
                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Mark as taken"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onEdit(reminder)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit reminder"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(reminder._id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete reminder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
