// src/components/Profile/utils/doctorDataTransforms.js

// Helper function to convert strings to arrays for backend
const stringToArray = (str) => {
  if (!str || typeof str !== "string") return [];
  return str
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// Transform doctor profile data for form display
export const transformDoctorProfileData = (profileData) => {
  return {
    ...profileData,
    name: profileData.userId?.name || "",
    email: profileData.userId?.email || "",

    // Basic fields
    specialization: profileData.specialization || "",
    experience: profileData.experience || 0,
    location: profileData.location || "",
    isAvailable: profileData.isAvailable || "Available",
    education: profileData.education || "",
    consultationFee: profileData.consultationFee || 0,
    nextAvailable: profileData.nextAvailable || "",
    about: profileData.about || "",
    phone: profileData.phone || "",

    // Transform arrays to strings for textarea/input display
    languages: Array.isArray(profileData.languages)
      ? profileData.languages.join(", ")
      : "",

    certifications: Array.isArray(profileData.certifications)
      ? profileData.certifications.join(", ")
      : "",

    // Transform availability array to formatted string
    availability: profileData.availability
      ? profileData.availability
          .map((slot) => {
            const slotsStr = slot.slots?.join("; ") || "";
            return `${slot.day}: ${slotsStr}`;
          })
          .join("\n")
      : "",

    // Keep references as-is (these typically aren't edited directly)
    rating: profileData.rating || 0,
    reviewCount: profileData.reviewCount || 0,
  };
};

// Prepare doctor data for backend submission
export const prepareDoctorDataForSubmission = (formData, profile) => {
  let dataToSend = { ...formData };

  // Transform languages from string to array
  dataToSend.languages = formData.languages
    ? stringToArray(formData.languages)
    : [];

  // Transform certifications from string to array
  dataToSend.certifications = formData.certifications
    ? stringToArray(formData.certifications)
    : [];

  // Transform availability from formatted string to array of objects
  if (formData.availability) {
    const availabilityLines = formData.availability
      .split("\n")
      .filter((line) => line.trim().length > 0);

    dataToSend.availability = availabilityLines.map((line) => {
      // Parse format like "Monday: 9:00 AM - 10:00 AM; 2:00 PM - 3:00 PM"
      const [day, slotsStr] = line.split(":").map((s) => s.trim());
      const slots = slotsStr
        ? slotsStr
            .split(";")
            .map((slot) => slot.trim())
            .filter(Boolean)
        : [];

      return {
        day: day || "",
        slots: slots,
      };
    });
  } else {
    dataToSend.availability = [];
  }

  // Convert numeric fields to numbers
  if (formData.experience) {
    dataToSend.experience = Number(formData.experience);
  }
  if (formData.consultationFee) {
    dataToSend.consultationFee = Number(formData.consultationFee);
  }

  // Remove user-related fields and references that shouldn't be updated
  delete dataToSend.name;
  delete dataToSend.email;
  delete dataToSend.userId;
  delete dataToSend._id;
  delete dataToSend.createdAt;
  delete dataToSend.updatedAt;
  delete dataToSend.__v;
  delete dataToSend.rating;
  delete dataToSend.reviewCount;
  delete dataToSend.patients;
  delete dataToSend.appointments;

  return dataToSend;
};
