import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import ReminderCard from "./ReminderCard";
import {
  isReminderActiveToday,
  sortRemindersByTime,
} from "../../utils/DateHelpers";

const ReminderListPage = ({
  reminders,
  onMarkAsTaken,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const [filter, setFilter] = useState("all");

  const sortedFilteredReminders = useMemo(() => {
    // Sort reminders by time
    const sorted = sortRemindersByTime(reminders);

    // Apply filter
    if (filter === "today") {
      return sorted.filter(isReminderActiveToday);
    }

    return sorted;
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
          <p className="text-black mb-4">
            {filter === "today"
              ? "No reminders scheduled for today"
              : "No reminders found"}
          </p>
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
