// src/components/Profile/utils/dataTransforms.js

// Helper function to convert strings to arrays for backend
const stringToArray = (str) => {
  if (!str || typeof str !== "string") return [];
  return str
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// Transform profile data for form display
export const transformProfileData = (profileData) => {
  return {
    ...profileData,
    name: profileData.userId?.name || "",
    email: profileData.userId?.email || "",

    // Transform complex arrays back to strings for textarea display
    medicalHistory:
      profileData.medicalHistory
        ?.map((item) => (typeof item === "object" ? item.condition : item))
        .join(", ") || "",

    allergies: Array.isArray(profileData.allergies)
      ? profileData.allergies.join(", ")
      : "",

    medications:
      profileData.medications
        ?.map((med) => {
          if (typeof med === "object") {
            return `${med.name}${med.dosage ? " - " + med.dosage : ""}${
              med.frequency ? " - " + med.frequency : ""
            }`;
          }
          return med;
        })
        .join(", ") || "",

    surgeries:
      profileData.surgeries
        ?.map((surgery) => {
          if (typeof surgery === "object") {
            return `${surgery.name}${
              surgery.date
                ? " - " + new Date(surgery.date).toLocaleDateString()
                : ""
            }${surgery.hospital ? " - " + surgery.hospital : ""}`;
          }
          return surgery;
        })
        .join(", ") || "",

    // Ensure nested objects exist
    emergencyContact: profileData.emergencyContact || {},
    insurance: profileData.insurance || {},
  };
};

// Prepare data for backend submission
export const prepareDataForSubmission = (formData, profile) => {
  let dataToSend = { ...formData };

  if (profile.userId.role === "patient") {
    // Transform medicalHistory from string to array of objects
    if (formData.medicalHistory) {
      const conditions = stringToArray(formData.medicalHistory);
      dataToSend.medicalHistory = conditions.map((condition) => ({
        condition: condition.trim(),
        diagnosedDate: new Date(),
        status: "ongoing",
      }));
    } else {
      dataToSend.medicalHistory = [];
    }

    // Transform allergies to array of strings
    dataToSend.allergies = formData.allergies
      ? stringToArray(formData.allergies)
      : [];

    // Transform medications from string to array of objects
    if (formData.medications) {
      const meds = stringToArray(formData.medications);
      dataToSend.medications = meds.map((med) => {
        // Parse format like "Medicine Name - 10mg - Twice daily"
        const parts = med.split(" - ");
        return {
          name: parts[0]?.trim() || med.trim(),
          dosage: parts[1]?.trim() || "",
          frequency: parts[2]?.trim() || "",
          prescribedBy: null,
        };
      });
    } else {
      dataToSend.medications = [];
    }

    // Transform surgeries from string to array of objects
    if (formData.surgeries) {
      const surgeries = stringToArray(formData.surgeries);
      dataToSend.surgeries = surgeries.map((surgery) => {
        // Parse format like "Surgery Name - 2020-01-01 - Hospital Name"
        const parts = surgery.split(" - ");
        return {
          name: parts[0]?.trim() || surgery.trim(),
          date: parts[1] ? new Date(parts[1].trim()) : new Date(),
          hospital: parts[2]?.trim() || "",
        };
      });
    } else {
      dataToSend.surgeries = [];
    }
  }

  // Remove user-related fields that shouldn't be updated
  delete dataToSend.name;
  delete dataToSend.email;
  delete dataToSend.userId;
  delete dataToSend._id;
  delete dataToSend.createdAt;
  delete dataToSend.updatedAt;
  delete dataToSend.__v;

  return dataToSend;
};
