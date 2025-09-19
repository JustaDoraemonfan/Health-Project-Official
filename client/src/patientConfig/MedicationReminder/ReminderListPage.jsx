import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import ReminderCard from "./ReminderCard";

// Check if reminder is active for today
const checkTodayOrNot = (reminder) => {
  const timezone =
    reminder.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  today.setHours(0, 0, 0, 0);

  const start = new Date(reminder.startDate);
  const end = new Date(reminder.endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return today >= start && today <= end;
};

const ReminderListPage = ({
  reminders,
  onMarkAsTaken,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const [filter, setFilter] = useState("all");

  const sortedFilteredReminders = useMemo(() => {
    // Sort by first reminder time or start date
    const sorted = [...reminders].sort((a, b) => {
      const aDateTime = new Date(`${a.startDate}T${a.times?.[0] || "00:00"}`);
      const bDateTime = new Date(`${b.startDate}T${b.times?.[0] || "00:00"}`);
      return aDateTime - bDateTime;
    });

    // Apply filter
    return sorted.filter((reminder) =>
      filter === "today" ? checkTodayOrNot(reminder) : true
    );
  }, [reminders, filter]);

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

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {["all", "today"].map((filterType) => (
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

      {/* Reminder List */}
      {sortedFilteredReminders.length === 0 ? (
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
          {sortedFilteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder._id}
              reminder={
                filter === "today"
                  ? { ...reminder, displayDate: new Date().toISOString() }
                  : reminder
              }
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
