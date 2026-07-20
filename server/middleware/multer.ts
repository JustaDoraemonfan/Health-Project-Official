import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import path from "path";
import fs from "fs";

interface AllowedFileTypes {
  extensions: string[];
  mimes: string[];
  errorMessage: string;
}

const ensureDirectoryExists = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createFileFilter =
  (allowedTypes: AllowedFileTypes) =>
  (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    if (
      !allowedTypes.extensions.includes(ext) ||
      !allowedTypes.mimes.includes(mimeType)
    ) {
      return cb(new Error(allowedTypes.errorMessage));
    }

    cb(null, true);
  };

const prescriptionFileTypes = {
  extensions: [".jpg", ".jpeg", ".png", ".pdf"],
  mimes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  errorMessage: "Only images and PDF files are allowed for prescriptions!",
};

const prescriptionStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadPath = "uploads/prescriptions/";
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
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
