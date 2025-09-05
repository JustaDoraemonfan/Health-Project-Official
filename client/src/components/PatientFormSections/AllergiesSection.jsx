// src/components/Profile/components/PatientFormSections/AllergiesSection.jsx
import React from "react";

const AllergiesSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-6 google-sans-code-400">
      <h4 className="text-lg font-medium text-gray-200 mb-3">Allergies</h4>
      <div>
        <label
          htmlFor="allergies"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Known Allergies
          <span className="text-sm text-gray-500 ml-2">
            (separate multiple items with commas)
          </span>
        </label>
        <textarea
          id="allergies"
          name="allergies"
          value={formData.allergies || ""}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
          placeholder="Specify any medication, food, or environmental allergies (separated by commas)"
        />
      </div>
    </div>
  );
};

export default AllergiesSection;
