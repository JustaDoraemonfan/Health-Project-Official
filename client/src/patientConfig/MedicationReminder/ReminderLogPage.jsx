import React, { useState } from "react";
import { Calendar, Clock, X, Filter } from "lucide-react";

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
  const [statusFilter, setStatusFilter] = useState("all");

  // Normalize date for comparison
  const normalize = (d) => new Date(d).setHours(0, 0, 0, 0);

  const filteredReminders = reminders.map((reminder) => {
    const entries = Object.entries(reminder.dailyStatus || {}).filter(
      ([date, status]) => {
        // Filter by status
        if (statusFilter !== "all" && status !== statusFilter) return false;
        // Filter by date
        if (!dateFilter) return true;
        const filterDate = normalize(new Date(dateFilter));
        const entryDate = normalize(new Date(date));
        return filterDate === entryDate;
      }
    );
    return {
      ...reminder,
      logEntries: entries.sort((a, b) => new Date(a[0]) - new Date(b[0])),
    };
  });

  const displayedReminders = filteredReminders.filter(
    (r) => r.logEntries.length > 0
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-black">Reminder Log</h1>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "taken", "missed"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setStatusFilter(filterType)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors hover:cursor-pointer ${
              statusFilter === filterType
                ? "bg-black text-white"
                : "bg-white border border-black/20 text-black hover:bg-gray-50"
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

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
      {displayedReminders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No log entries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReminders.map((reminder) => (
            <div
              key={reminder._id}
              className="bg-[var(--color-secondary)]/90 rounded-lg shadow-sm border border-black/10 p-4 flex justify-between"
            >
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

              {/* Daily Status Log on the right */}
              <div className="flex flex-col items-end space-y-1">
                {reminder.logEntries.map(([date, status]) => (
                  <span
                    key={date}
                    className={`text-xs font-medium ${
                      status === "taken" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatDate(date)}:{" "}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderLogPage;
