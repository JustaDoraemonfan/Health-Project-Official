import React, { useState } from "react";
import { Filter, X, Calendar, Clock } from "lucide-react";

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

const ReminderLogPage = ({ reminders }) => {
  const [dateFilter, setDateFilter] = useState("");

  // Normalize date for comparison
  const normalize = (d) => new Date(d).setHours(0, 0, 0, 0);

  const logEntries = reminders
    .filter((reminder) => reminder.status != "upcomming")
    .filter((reminder) => {
      if (!dateFilter) return true;

      const filterDate = normalize(dateFilter);
      const start = normalize(reminder.startDate);
      const end = normalize(reminder.endDate);

      return filterDate >= start && filterDate <= end;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-black">Reminder Log</h1>

      {/* Date Filter */}
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

      {/* Log Entries */}
      {logEntries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No log entries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logEntries.map((reminder) => (
            <div
              key={reminder._id}
              className="bg-[var(--color-secondary)]/90 rounded-lg shadow-sm border border-black/10 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--color-primary)]">
                    {reminder.medicine}
                  </h3>
                  <p className="text-green-400 text-sm">{reminder.dosage}</p>

                  {/* Dates */}
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-white">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {formatDate(reminder.startDate)} -{" "}
                        {formatDate(reminder.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Times */}
                  {reminder.times && reminder.times.length > 0 && (
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
                </div>

                {/* Status */}
                <div>
                  {reminder.status === "taken" ? (
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                      Taken
                    </span>
                  ) : reminder.status === "missed" ? (
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                      Missed
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  )}
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
