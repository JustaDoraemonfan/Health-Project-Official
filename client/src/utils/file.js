// utils/file.js
export const getPdfUrl = (filePath) => {
  const baseURL = process.env.CLIENT_URL || "http://localhost:5173"; // or your deployed API URL
  return `${baseURL}/${filePath.replace(/\\/g, "/")}`;
};
