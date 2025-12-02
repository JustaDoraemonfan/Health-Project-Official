// src/components/Profile/components/PatientFormSections/InsuranceSection.jsx
import React from "react";

const InsuranceSection = ({ formData, handleChange }) => {
  return (
    <div className="mb-6 spline-sans-mono-400">
      <h4 className="text-lg font-medium text-[var(--color-seconary)] mb-3">
        Insurance Information (Optional)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="insuranceProvider"
            className="block text-sm font-medium text-[var(--color-seconary)] mb-2"
          >
            Provider
          </label>
          <input
            type="text"
            id="insuranceProvider"
            name="insurance.provider"
            value={formData.insurance?.provider || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
            placeholder="Provider Name"
          />
        </div>
        <div>
          <label
            htmlFor="insurancePolicyNumber"
            className="block text-sm font-medium text-[var(--color-seconary)] mb-2"
          >
            Policy Number
          </label>
          <input
            type="text"
            id="insurancePolicyNumber"
            name="insurance.policyNumber"
            value={formData.insurance?.policyNumber || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
            placeholder="Policy Number"
          />
        </div>
        <div>
          <label
            htmlFor="insuranceValidTill"
            className="block text-sm font-medium text-[var(--color-seconary)] mb-2"
          >
            Valid Until
          </label>
          <input
            type="date"
            id="insuranceValidTill"
            name="insurance.validTill"
            value={
              formData.insurance?.validTill
                ? new Date(formData.insurance.validTill)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical"
          />
        </div>
      </div>
    </div>
  );
};

export default InsuranceSection;
