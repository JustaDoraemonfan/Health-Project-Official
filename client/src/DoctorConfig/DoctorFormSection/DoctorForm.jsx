// src/components/Profile/components/DoctorForm.jsx
import React from "react";

const DoctorForm = ({ formData, handleChange }) => {
  return (
    <>
      <h3 className="text-xl font-semibold text-amber-50 mb-4 border-b border-gray-600 pb-2">
        Doctor Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Cardiology, Neurology"
          />
        </div>
        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Years of Experience
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience || ""}
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Years of experience"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="licenseNumber"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          License Number
        </label>
        <input
          type="text"
          id="licenseNumber"
          name="licenseNumber"
          value={formData.licenseNumber || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Medical license number"
        />
      </div>

      <div>
        <label
          htmlFor="biography"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Professional Biography
        </label>
        <textarea
          id="biography"
          name="biography"
          value={formData.biography || ""}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
          placeholder="Brief professional biography, education, achievements, etc."
        />
      </div>
    </>
  );
};

export default DoctorForm;
