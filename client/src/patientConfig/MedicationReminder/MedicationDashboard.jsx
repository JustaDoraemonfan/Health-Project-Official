// App.jsx
import React, { useState } from "react";
import ReminderListPage from "./ReminderListPage";
import ReminderLogPage from "./ReminderLogPage";
import ReminderForm from "./ReminderForm";

const App = () => {
  const [currentPage, setCurrentPage] = useState("reminders");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminders, setReminders] = useState([
    {
      id: 1,
      medication: "Vitamin D",
      dosage: "1000 IU",
      date: "2025-09-13",
      time: "08:00",
      frequency: "daily",
      status: "upcoming",
    },
    {
      id: 2,
      medication: "Blood Pressure Medication",
      dosage: "10mg",
      date: "2025-09-13",
      time: "12:00",
      frequency: "daily",
      status: "taken",
    },
    {
      id: 3,
      medication: "Calcium",
      dosage: "500mg",
      date: "2025-09-12",
      time: "20:00",
      frequency: "daily",
      status: "upcoming",
    },
  ]);

  const handleCreateNew = () => {
    setEditingReminder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };

  const handleSave = (formData) => {
    if (editingReminder) {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingReminder.id
            ? {
                ...formData,
                id: editingReminder.id,
                status: editingReminder.status,
              }
            : r
        )
      );
    } else {
      const newReminder = {
        ...formData,
        id: Date.now(),
        status: "upcoming",
      };
      setReminders((prev) => [...prev, newReminder]);
    }
  };

  const handleMarkAsTaken = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "taken" } : r))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf2]">
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
