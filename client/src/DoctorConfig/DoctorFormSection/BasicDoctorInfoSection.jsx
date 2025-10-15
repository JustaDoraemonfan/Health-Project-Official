// src/DoctorConfig/DoctorFormSection/BasicDoctorInfoSection.jsx
import React from "react";
import { Stethoscope } from "lucide-react";

const BasicDoctorInfoSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
          <Stethoscope className="h-5 w-5 text-blue-400" />
        </div>
        <h4 className="text-xl font-semibold text-black">Basic Information</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., +91 9876543210"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Mumbai, Maharashtra"
          />
        </div>

        <div>
          <label
            htmlFor="isAvailable"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Current Status
          </label>
          <select
            id="isAvailable"
            name="isAvailable"
            value={formData.isAvailable || "Available"}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="In Surgery">In Surgery</option>
            <option value="On Break">On Break</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="nextAvailable"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Next Available
          </label>
          <input
            type="text"
            id="nextAvailable"
            name="nextAvailable"
            value={formData.nextAvailable || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Today, 4:15 PM"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDoctorInfoSection;
