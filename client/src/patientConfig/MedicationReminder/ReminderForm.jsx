// ReminderForm.jsx
import React, { useState, useEffect } from "react";

const ReminderForm = ({ isOpen, onClose, onSave, editingReminder }) => {
  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    frequency: "daily",
    times: [""], // at least one time
    intervalHours: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    timezone: "Asia/Kolkata",
    notes: "",
    isActive: true,
  });

  useEffect(() => {
    if (editingReminder) {
      setFormData({
        ...editingReminder,
        startDate: editingReminder.startDate
          ? editingReminder.startDate.split("T")[0]
          : "",
        endDate: editingReminder.endDate
          ? editingReminder.endDate.split("T")[0]
          : "",
      });
    }
  }, [editingReminder, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const addTimeField = () => {
    setFormData({ ...formData, times: [...formData.times, ""] });
  };

  const removeTimeField = (index) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({ ...formData, times: newTimes });
  };

  const handleSubmit = () => {
    if (formData.medicine && formData.times.length > 0 && formData.startDate) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          {editingReminder ? "Edit Reminder" : "Create New Reminder"}
        </h2>
        <div className="space-y-4">
          {/* Medicine */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/20 rounded"
              placeholder="Enter medicine name"
              required
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Dosage
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/20 rounded"
              placeholder="e.g., 500mg, 2 tablets"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/20 rounded"
            >
              <option value="daily">Daily</option>
              <option value="multiple_times">Multiple Times</option>
              <option value="intervalHours">Every X Hours</option>
            </select>
          </div>

          {/* Interval Hours (only if frequency === intervalHours) */}
          {formData.frequency === "intervalHours" && (
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Interval Hours *
              </label>
              <input
                type="number"
                name="intervalHours"
                value={formData.intervalHours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black/20 rounded"
                placeholder="e.g., 8"
              />
            </div>
          )}

          {/* Times */}
          {formData.frequency !== "intervalHours" && (
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Reminder Times *
              </label>
              {formData.times.map((time, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-black/20 rounded"
                  />
                  {formData.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeField(index)}
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTimeField}
                className="text-blue-600 text-sm mt-1"
              >
                + Add Time
              </button>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black/20 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black/20 rounded"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black/20 rounded"
              placeholder="Any special instructions..."
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label className="text-sm text-black">Active</label>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              {editingReminder ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-black text-black px-4 py-2 rounded hover:bg-gray-50"
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
