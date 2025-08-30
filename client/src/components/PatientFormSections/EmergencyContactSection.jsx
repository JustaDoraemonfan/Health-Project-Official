// src/components/Profile/components/PatientFormSections/EmergencyContactSection.jsx
import React from "react";

const EmergencyContactSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-6 font-mono">
      <h4 className="text-lg font-medium text-gray-200 mb-3">
        Emergency Contact
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="emergencyContactName"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="emergencyContactName"
            name="emergencyContact.name"
            value={formData.emergencyContact?.name || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
            placeholder="Enter contact name"
          />
        </div>
        <div>
          <label
            htmlFor="emergencyContactRelation"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Relationship
          </label>
          <input
            type="text"
            id="emergencyContactRelation"
            name="emergencyContact.relation"
            value={formData.emergencyContact?.relation || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
            placeholder="e.g., Parent, Spouse, Sibling"
          />
        </div>
        <div>
          <label
            htmlFor="emergencyContactPhone"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="emergencyContactPhone"
            name="emergencyContact.phone"
            value={formData.emergencyContact?.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
            placeholder="Enter emergency contact number"
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactSection;
