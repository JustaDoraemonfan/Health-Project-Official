// constants/symptomConstants.js

export const SEVERITY_OPTIONS = [
  { value: "Mild", label: "🟢 Mild", color: "text-green-600" },
  { value: "Moderate", label: "🟡 Moderate", color: "text-yellow-600" },
  { value: "Severe", label: "🔴 Severe", color: "text-red-600" },
];

export const CATEGORY_OPTIONS = [
  "Respiratory",
  "Digestive",
  "Musculoskeletal",
  "Cardiovascular",
  "Neurological",
  "Dermatological",
  "Other",
];

export const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

export const MAX_FILE_UPLOAD = 10;
