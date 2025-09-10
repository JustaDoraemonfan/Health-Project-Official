import express from "express";
import {
  uploadPrescription,
  getMyPrescriptions,
  getPatientPrescriptions,
} from "../controllers/prescriptionController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { prescriptionUpload } from "../middleware/multer.js"; // <--- now from middlewares

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("doctor"),
  prescriptionUpload.single("prescriptionPdf"), // multer middleware
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
