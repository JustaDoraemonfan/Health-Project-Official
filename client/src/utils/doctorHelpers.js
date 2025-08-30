// utils/doctorHelpers.js
import { SPECIALTY_COLORS } from "./constants";

// Get availability status styling
export const getAvailabilityStyle = (isAvailable) => {
  return isAvailable
    ? "bg-green-900/40 text-green-300 border border-green-700 shadow-green-900/20"
    : "bg-red-900/40 text-red-300 border border-red-700 shadow-red-900/20";
};

// Get specialty color
export const getSpecialtyColor = (specialty) => {
  return SPECIALTY_COLORS[specialty] || "text-gray-400";
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Basic formatting - you can enhance this based on your needs
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
};

// Format consultation fee
export const formatConsultationFee = (fee) => {
  if (!fee) return "Contact for pricing";
  return `$${fee}`;
};

// Check if doctor has certifications
export const hasCertifications = (doctor) => {
  return doctor.certifications && doctor.certifications.length > 0;
};

// Check if doctor has languages listed
export const hasLanguages = (doctor) => {
  return doctor.languages && doctor.languages.length > 0;
};

// Get doctor's full display name
export const getDoctorName = (doctor) => {
  return doctor.userId?.name || "Unknown Doctor";
};

// Get doctor's rating display
export const getRatingDisplay = (doctor) => {
  const rating = doctor.rating || 0;
  const reviewCount = doctor.reviewCount || 0;
  return {
    rating: rating.toFixed(1),
    reviewText: `${reviewCount} review${reviewCount !== 1 ? "s" : ""}`,
  };
};
