import React from "react";
import { Calendar, UserCircle } from "lucide-react";

const PatientForm = ({ formData, handleInputChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="age"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Age
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="age"
            name="age"
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Age"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Gender
        </label>
        <div className="relative">
          <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none bg-white"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
