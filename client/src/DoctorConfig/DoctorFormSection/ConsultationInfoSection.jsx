// src/DoctorConfig/DoctorFormSection/ConsultationInfoSection.jsx
import React from "react";
import { DollarSign } from "lucide-react";

const ConsultationInfoSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mr-4">
          <DollarSign className="h-5 w-5 text-amber-400" />
        </div>
        <h4 className="text-xl font-semibold text-black">
          Consultation Information
        </h4>
      </div>

      <div>
        <label
          htmlFor="consultationFee"
          className="block text-sm font-medium text-zinc-700 mb-2"
        >
          Consultation Fee (₹)
        </label>
        <input
          type="number"
          id="consultationFee"
          name="consultationFee"
          value={formData.consultationFee || 0}
          onChange={handleChange}
          min="0"
          step="50"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="e.g., 500"
        />
        <p className="mt-2 text-xs text-gray-400">
          Enter your consultation fee in Indian Rupees
        </p>
      </div>
    </div>
  );
};

export default ConsultationInfoSection;
