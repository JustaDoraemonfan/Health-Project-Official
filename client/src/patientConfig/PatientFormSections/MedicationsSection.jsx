// src/components/Profile/components/PatientFormSections/MedicationsSection.jsx
import React from "react";

const MedicationsSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-6 google-sans-code-400">
      <h4 className="text-lg font-medium text-[var(--color-seconary)] mb-3">
        Current Medications
      </h4>
      <div>
        <label
          htmlFor="medications"
          className="block text-sm font-medium text-[var(--color-seconary)] mb-2"
        >
          Ongoing Medications
          <span className="text-sm text-gray-500 ml-2">
            (separate multiple items with commas)
          </span>
        </label>
        <textarea
          id="medications"
          name="medications"
          value={formData.medications || ""}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
          placeholder="List medications with dosage and frequency (separated by commas)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Format: Medicine Name - Dosage - Frequency (e.g., Aspirin - 81mg -
          Daily)
        </p>
      </div>
    </div>
  );
};

export default MedicationsSection;
