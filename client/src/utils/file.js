// utils/file.js
export const getPdfUrl = (filePath) => {
  const baseURL = import.meta.BASE_VITE_API_URL || "http://localhost:5000";
  return `${baseURL}/${filePath.replace(/\\/g, "/")}`;
};
