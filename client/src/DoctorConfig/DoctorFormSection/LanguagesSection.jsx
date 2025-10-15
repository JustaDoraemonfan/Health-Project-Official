// src/DoctorConfig/DoctorFormSection/LanguagesSection.jsx
import React from "react";
import { Languages } from "lucide-react";

const LanguagesSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center mr-4">
          <Languages className="h-5 w-5 text-cyan-400" />
        </div>
        <h4 className="text-xl font-semibold text-black">Languages Spoken</h4>
      </div>

      <div>
        <label
          htmlFor="languages"
          className="block text-sm font-medium text-zinc-700 mb-2"
        >
          Languages
        </label>
        <input
          type="text"
          id="languages"
          name="languages"
          value={formData.languages || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="e.g., English, Hindi, Bengali, Tamil"
        />
        <p className="mt-2 text-xs text-gray-400">
          Separate multiple languages with commas
        </p>
      </div>
    </div>
  );
};

export default LanguagesSection;
