// utils/file.js
export const getPdfUrl = (filePath) => {
  const baseURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  return `${baseURL}/${filePath.replace(/\\/g, "/")}`;
};
