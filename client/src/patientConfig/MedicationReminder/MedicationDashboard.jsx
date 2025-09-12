// App.jsx
import React, { useState, useEffect } from "react";
import ReminderListPage from "./ReminderListPage";
import ReminderLogPage from "./ReminderLogPage";
import ReminderForm from "./ReminderForm";
import { reminderAPI } from "../../services/api";

const App = () => {
  const [currentPage, setCurrentPage] = useState("reminders");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminders, setReminders] = useState([]);

  // ✅ Fetch reminders on mount
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await reminderAPI.getReminders();
        setReminders(res.data.data || []); // Adjust depending on API response shape
      } catch (err) {
        console.error("Error fetching reminders:", err);
      }
    };
    fetchReminders();
  }, []);

  // ✅ Open form for new reminder
  const handleCreateNew = () => {
    setEditingReminder(null);
    setIsFormOpen(true);
  };

  // ✅ Open form for editing
  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };

  // ✅ Save new or updated reminder
  const handleSave = async (formData) => {
    try {
      if (editingReminder) {
        // Update reminder
        const res = await reminderAPI.updateReminder(
          editingReminder._id,
          formData
        );
        setReminders((prev) =>
          prev.map((r) => (r._id === editingReminder._id ? res.data.data : r))
        );
      } else {
        // Create new reminder
        const res = await reminderAPI.createReminder(formData);
        setReminders((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error("Error saving reminder:", err);
    }
  };

  // ✅ Mark reminder as taken
  const handleMarkAsTaken = async (id) => {
    try {
      const res = await reminderAPI.updateReminder(id, { status: "taken" });
      setReminders((prev) =>
        prev.map((r) => (r._id === id ? res.data.data : r))
      );
    } catch (err) {
      console.error("Error marking reminder as taken:", err);
    }
  };

  // ✅ Delete reminder
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await reminderAPI.deleteReminder(id);
        setReminders((prev) => prev.filter((r) => r._id !== id));
      } catch (err) {
        console.error("Error deleting reminder:", err);
      }
    }
  };

  return (
    <div className="min-h-screen google-sans-code-400 bg-[#fffdf2]">
      <div className="max-w-4xl mx-auto p-4">
        {/* Navigation */}
        <nav className="mb-6 border-b border-black/10 pb-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setCurrentPage("reminders")}
              className={`pb-2 font-medium transition-colors ${
                currentPage === "reminders"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setCurrentPage("log")}
              className={`pb-2 font-medium transition-colors ${
                currentPage === "log"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Log
            </button>
          </div>
        </nav>

        {/* Page Content */}
        {currentPage === "reminders" && (
          <ReminderListPage
            reminders={reminders}
            onMarkAsTaken={handleMarkAsTaken}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
          />
        )}

        {currentPage === "log" && <ReminderLogPage reminders={reminders} />}

        {/* Form Modal */}
        <ReminderForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingReminder(null);
          }}
          onSave={handleSave}
          editingReminder={editingReminder}
        />
      </div>
    </div>
  );
};

export default App;
