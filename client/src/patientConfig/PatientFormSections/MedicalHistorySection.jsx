// src/components/Profile/components/PatientFormSections/MedicalHistorySection.jsx
import React from "react";

const MedicalHistorySection = ({ formData, handleChange }) => {
  return (
    <div className="mb-6 google-sans-code-400">
      <h4 className="text-lg font-medium text-[var(--color-seconary)] mb-3">
        Medical History
      </h4>
      <div>
        <label
          htmlFor="medicalHistory"
          className="block text-sm font-medium text-[var(--color-seconary)] mb-2"
        >
          Past Medical Conditions
          <span className="text-sm text-gray-500 ml-2">
            (separate multiple items with commas)
          </span>
        </label>
        <textarea
          id="medicalHistory"
          name="medicalHistory"
          value={formData.medicalHistory || ""}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
          placeholder="List previous diagnoses, chronic illnesses, or relevant conditions (separated by commas)"
        />
      </div>
    </div>
  );
};

export default MedicalHistorySection;
