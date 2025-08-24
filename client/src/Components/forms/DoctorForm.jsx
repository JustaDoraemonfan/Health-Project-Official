import React from "react";
import { Award } from "lucide-react";

const DoctorForm = ({ formData, handleInputChange }) => {
  return (
    <div>
      <label
        htmlFor="specialization"
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        Medical Specialization
      </label>
      <div className="relative">
        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="specialization"
          name="specialization"
          type="text"
          value={formData.specialization}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          placeholder="e.g., Cardiology, Pediatrics, Internal Medicine"
        />
      </div>
    </div>
  );
};

export default DoctorForm;
