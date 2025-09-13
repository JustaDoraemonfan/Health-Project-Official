// ReminderListPage.jsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import ReminderCard from "./ReminderCard";

const ReminderListPage = ({
  reminders,
  onMarkAsTaken,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const [filter, setFilter] = useState("all");

  const filteredReminders = reminders.filter((reminder) => {
    switch (filter) {
      case "today":
        return reminder.status === "today";
      case "upcoming":
        return reminder.status === "upcoming";
      case "taken":
        return reminder.status === "taken";
      case "missed":
        return reminder.status === "missed";
      default:
        return true;
    }
  });

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    const aDateTime = new Date(`${a.startDate}T${a.times[0]}`);
    const bDateTime = new Date(`${b.startDate}T${b.times[0]}`);
    return aDateTime - bDateTime;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-black">My Reminders</h1>
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-2 hover:cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "today", "upcoming", "taken", "missed"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors hover:cursor-pointer ${
              filter === filterType
                ? "bg-black text-white"
                : "bg-white border border-black/20 text-black hover:bg-gray-50"
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {sortedReminders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-black mb-4">No reminders found</p>
          <button
            onClick={onCreateNew}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Create your first reminder
          </button>
        </div>
      ) : (
        <div>
          {sortedReminders.map((reminder) => (
            <ReminderCard
              key={reminder._id}
              reminder={reminder}
              onMarkAsTaken={onMarkAsTaken}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderListPage;
