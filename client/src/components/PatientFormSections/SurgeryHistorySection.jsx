import React from "react";

const SurgeryHistorySection = ({ formData, handleChange }) => {
  return (
    <div className="mb-6 google-sans-code-400">
      <h4 className="text-lg font-medium text-slate-100 mb-3">
        Surgical History
      </h4>
      <div>
        <label
          htmlFor="surgeries"
          className="block text-sm font-medium text-slate-200 mb-2"
        >
          Previous Surgeries
          <span className="text-sm text-slate-400 ml-2">
            (separate multiple items with commas)
          </span>
        </label>
        <textarea
          id="surgeries"
          name="surgeries"
          value={formData.surgeries || ""}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
          placeholder="List surgeries with dates and hospital names (separated by commas)"
        />
        <p className="text-xs text-slate-400 mt-1">
          Format: Surgery Name - Date - Hospital (e.g., Appendectomy -
          2020-01-15 - City Hospital)
        </p>
      </div>
    </div>
  );
};

export default SurgeryHistorySection;
