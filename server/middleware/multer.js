// middleware/multer.js
// Local disk storage for prescriptions only.
// Symptom file uploads are handled by uploadSymptomFiles in config/s3.js.

import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

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

const prescriptionFileTypes = {
  extensions: [".jpg", ".jpeg", ".png", ".pdf"],
  mimes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  errorMessage: "Only images and PDF files are allowed for prescriptions!",
};

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

export const prescriptionUpload = multer({
  storage: prescriptionStorage,
  fileFilter: createFileFilter(prescriptionFileTypes),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export default prescriptionUpload;
