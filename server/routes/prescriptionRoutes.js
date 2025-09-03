import express from "express";
import {
  uploadPrescription,
  getMyPrescriptions,
  getPatientPrescriptions,
} from "../controllers/prescriptionController.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js"; // <--- now from middlewares

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("doctor"),
  upload.single("prescriptionPdf"), // multer middleware
  uploadPrescription
);

router.get(
  "/mine",
  authMiddleware,
  authorizeRoles("patient"),
  getMyPrescriptions
);

router.get(
  "/:patientId",
  authMiddleware,
  authorizeRoles("doctor"),
  getPatientPrescriptions
);

export default router;
