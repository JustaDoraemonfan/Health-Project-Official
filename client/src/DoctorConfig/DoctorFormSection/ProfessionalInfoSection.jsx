// src/DoctorConfig/DoctorFormSection/ProfessionalInfoSection.jsx
import React from "react";
import { Briefcase } from "lucide-react";

const ProfessionalInfoSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
          <Briefcase className="h-5 w-5 text-purple-400" />
        </div>
        <h4 className="text-xl font-semibold text-black">
          Professional Details
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Specialization *
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization || ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Cardiology, Neurology, Pediatrics"
          />
        </div>

        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Years of Experience
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience || 0}
            onChange={handleChange}
            min="0"
            max="60"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., 10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoSection;
