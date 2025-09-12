// ReminderLogPage.jsx
import React, { useState } from "react";
import { Filter, X, Calendar, Clock } from "lucide-react";

// Utility functions (you'll need these in your utils file)
const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  return `${hour12}:${minutes} ${ampm}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const isReminderMissed = (reminder) => {
  const now = new Date();
  const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
  return reminderDateTime < now && reminder.status === "upcoming";
};

const ReminderLogPage = ({ reminders }) => {
  const [dateFilter, setDateFilter] = useState("");

  const logEntries = reminders
    .filter(
      (reminder) => reminder.status === "taken" || isReminderMissed(reminder)
    )
    .filter((reminder) => !dateFilter || reminder.date === dateFilter)
    .sort((a, b) => {
      const aDateTime = new Date(`${a.date}T${a.time}`);
      const bDateTime = new Date(`${b.date}T${b.time}`);
      return bDateTime - aDateTime;
    });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-black">Reminder Log</h1>

      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-600" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
          placeholder="Filter by date"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter("")}
            className="text-gray-500 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {logEntries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No log entries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logEntries.map((reminder) => (
            <div
              key={`${reminder.id}-${reminder.date}-${reminder.time}`}
              className="bg-white rounded-lg shadow-sm border border-black/10 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-black">
                    {reminder.medication}
                  </h3>
                  <p className="text-gray-600 text-sm">{reminder.dosage}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {formatDate(reminder.date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {formatTime(reminder.time)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  {reminder.status === "taken" ? (
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                      Taken
                    </span>
                  ) : isReminderMissed(reminder) ? (
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                      Missed
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderLogPage;
