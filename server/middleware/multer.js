import multer from "multer";
import path from "path";

// Define where to store files + how to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/prescriptions/");
    // All files go inside this folder (make sure it exists!)
  },
  filename: (req, file, cb) => {
    // Example: 1693759274932-prescription.pdf
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter (only accept PDFs)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".pdf") {
    return cb(new Error("Only PDF files are allowed!"), false);
  }
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

export default upload;
