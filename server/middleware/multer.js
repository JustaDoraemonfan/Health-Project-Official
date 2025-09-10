// middleware/multer.js - Updated with multiple configurations

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Common file filter for medical documents
const createFileFilter = (allowedTypes) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  if (
    !allowedTypes.extensions.includes(ext) ||
    !allowedTypes.mimes.includes(mimeType)
  ) {
    return cb(new Error(allowedTypes.errorMessage), false);
  }

  cb(null, true);
};

// File types for prescriptions (stricter - mainly PDFs and images)
const prescriptionFileTypes = {
  extensions: [".jpg", ".jpeg", ".png", ".pdf"],
  mimes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  errorMessage: "Only images and PDF files are allowed for prescriptions!",
};

// File types for symptoms (more flexible)
const symptomFileTypes = {
  extensions: [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"],
  mimes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  errorMessage:
    "Only images, PDF, and Word document files are allowed for symptoms!",
};

// Prescription upload configuration
const prescriptionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/prescriptions/";
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Symptom upload configuration
const symptomStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/symptoms/";
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Export different upload instances
export const prescriptionUpload = multer({
  storage: prescriptionStorage,
  fileFilter: createFileFilter(prescriptionFileTypes),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max for prescriptions
    files: 5, // Maximum 5 prescription files
  },
});

export const symptomUpload = multer({
  storage: symptomStorage,
  fileFilter: createFileFilter(symptomFileTypes),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max for symptoms (larger for docs)
    files: 10, // Maximum 10 symptom files
  },
});

// Default export for backward compatibility (prescriptions)
export default prescriptionUpload;
