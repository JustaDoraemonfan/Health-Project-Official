// src/DoctorConfig/DoctorFormSection/EducationCertificationsSection.jsx
import React from "react";
import { GraduationCap } from "lucide-react";

const EducationCertificationsSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mr-4">
          <GraduationCap className="h-5 w-5 text-emerald-400" />
        </div>
        <h4 className="text-xl font-semibold text-black">
          Education & Certifications
        </h4>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="education"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Education
          </label>
          <textarea
            id="education"
            name="education"
            value={formData.education || ""}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
            placeholder="e.g., MBBS from AIIMS Delhi, MD in Cardiology from Johns Hopkins"
          />
          <p className="mt-2 text-xs text-gray-400">
            List your degrees and institutions
          </p>
        </div>

        <div>
          <label
            htmlFor="certifications"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Certifications
          </label>
          <textarea
            id="certifications"
            name="certifications"
            value={formData.certifications || ""}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
            placeholder="e.g., Board Certified Cardiologist, ACLS Certified, Fellowship in Interventional Cardiology"
          />
          <p className="mt-2 text-xs text-gray-400">
            Separate multiple certifications with commas
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationCertificationsSection;
