// src/DoctorConfig/DoctorFormSection/DoctorForm.jsx
import React from "react";
import BasicDoctorInfoSection from "./BasicDoctorInfoSection";
import ProfessionalInfoSection from "./ProfessionalInfoSection";
import EducationCertificationsSection from "./EducationCertificationsSection";
import LanguagesSection from "./LanguagesSection";
import AvailabilitySection from "./AvailabilitySection";
import ConsultationInfoSection from "./ConsultationInfoSection";
import AboutSection from "./AboutSection";

const DoctorForm = ({ formData, handleChange }) => {
  return (
    <>
      <h3 className="text-xl google-sans-code-400 font-semibold text-[var(--color-secondary)] mb-4 border-b border-gray-600 pb-2">
        Doctor Profile
      </h3>

      <BasicDoctorInfoSection formData={formData} handleChange={handleChange} />
      <ProfessionalInfoSection
        formData={formData}
        handleChange={handleChange}
      />
      <EducationCertificationsSection
        formData={formData}
        handleChange={handleChange}
      />
      <LanguagesSection formData={formData} handleChange={handleChange} />
      <ConsultationInfoSection
        formData={formData}
        handleChange={handleChange}
      />
      <AvailabilitySection formData={formData} handleChange={handleChange} />
      <AboutSection formData={formData} handleChange={handleChange} />
    </>
  );
};

export default DoctorForm;
