// src/DoctorConfig/DoctorFormSection/AboutSection.jsx
import React from "react";
import { FileText } from "lucide-react";

const AboutSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center mr-4">
          <FileText className="h-5 w-5 text-rose-400" />
        </div>
        <h4 className="text-xl font-semibold text-black">About & Bio</h4>
      </div>

      <div>
        <label
          htmlFor="about"
          className="block text-sm font-medium text-zinc-700 mb-2"
        >
          Professional Summary
        </label>
        <textarea
          id="about"
          name="about"
          value={formData.about || ""}
          onChange={handleChange}
          rows="6"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
          placeholder="Write a brief professional summary about yourself, your expertise, approach to patient care, and any special interests or achievements..."
        />
        <p className="mt-2 text-xs text-gray-400">
          This will be displayed on your public profile to help patients learn
          more about you
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
