// src/components/Profile/components/PatientForm.jsx
import React from "react";
import BasicInfoSection from "./BasicInfoSection";
import MedicalHistorySection from "./MedicalHistorySection";
import AllergiesSection from "./AllergiesSection";
import MedicationsSection from "./MedicationsSection";
import SurgeryHistorySection from "./SurgeryHistorySection";
import EmergencyContactSection from "./EmergencyContactSection";
import InsuranceSection from "./InsuranceSection";

const PatientForm = ({ formData, handleChange }) => {
  return (
    <>
      <h3 className="text-xl google-sans-code-400 font-semibold text-[var(--color-secondary)] mb-4 border-b border-gray-600 pb-2">
        Patient Profile
      </h3>

      <BasicInfoSection formData={formData} handleChange={handleChange} />
      <MedicalHistorySection formData={formData} handleChange={handleChange} />
      <AllergiesSection formData={formData} handleChange={handleChange} />
      <MedicationsSection formData={formData} handleChange={handleChange} />
      <SurgeryHistorySection formData={formData} handleChange={handleChange} />
      <EmergencyContactSection
        formData={formData}
        handleChange={handleChange}
      />
      <InsuranceSection formData={formData} handleChange={handleChange} />
    </>
  );
};

export default PatientForm;
