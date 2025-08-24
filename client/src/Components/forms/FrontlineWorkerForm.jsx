import React from "react";
import { Phone, MapPin } from "lucide-react";

const FrontlineWorkerForm = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Work Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="e.g., Village Name, Ward, Block"
          />
        </div>
      </div>
    </div>
  );
};

export default FrontlineWorkerForm;
