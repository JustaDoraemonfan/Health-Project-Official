// ReminderListPage.jsx
import { Plus } from "lucide-react";
import ReminderCard from "./ReminderCard";

const ReminderListPage = ({
  reminders,
  onMarkAsTaken,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const sortedReminders = [...reminders].sort((a, b) => {
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
