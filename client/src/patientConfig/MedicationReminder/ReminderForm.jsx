// ReminderForm.jsx
import React, { useState, useEffect } from "react";

const ReminderForm = ({ isOpen, onClose, onSave, editingReminder }) => {
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    date: "",
    time: "",
    frequency: "once",
  });

  useEffect(() => {
    if (editingReminder) {
      setFormData(editingReminder);
    } else {
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toTimeString().slice(0, 5);
      setFormData({
        medication: "",
        dosage: "",
        date: today,
        time: now,
        frequency: "once",
      });
    }
  }, [editingReminder, isOpen]);

  const handleSubmit = () => {
    if (formData.medication && formData.date && formData.time) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          {editingReminder ? "Edit Reminder" : "Create New Reminder"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Medication Name *
            </label>
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
              placeholder="Enter medication name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Dosage
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
              placeholder="e.g., 500mg, 2 tablets"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/20 rounded focus:outline-none focus:border-black"
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              {editingReminder ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-black text-black px-4 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderForm;
