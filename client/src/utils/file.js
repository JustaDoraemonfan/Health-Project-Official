// utils/file.js
export const getPdfUrl = (filePath) => {
  const baseURL = "http://localhost:5000"; // or your deployed API URL
  return `${baseURL}/${filePath.replace(/\\/g, "/")}`;
};
