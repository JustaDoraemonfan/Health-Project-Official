// src/components/Profile/components/PatientForm.jsx
import React from "react";
import BasicInfoSection from "./PatientFormSections/BasicInfoSection";
import MedicalHistorySection from "./PatientFormSections/MedicalHistorySection";
import AllergiesSection from "./PatientFormSections/AllergiesSection";
import MedicationsSection from "./PatientFormSections/MedicationsSection";
import SurgeryHistorySection from "./PatientFormSections/SurgeryHistorySection";
import EmergencyContactSection from "./PatientFormSections/EmergencyContactSection";
import InsuranceSection from "./PatientFormSections/InsuranceSection";

const PatientForm = ({ formData, handleChange }) => {
  return (
    <>
      <h3 className="text-xl google-sans-code-400 font-semibold text-amber-50 mb-4 border-b border-gray-600 pb-2">
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
