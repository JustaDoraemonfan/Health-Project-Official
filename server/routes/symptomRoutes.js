// routes/symptomRoutes.js
import express from "express";
import {
  addSymptom,
  updateSymptom,
  getSymptoms,
  getSymptomById,
  getSymptomsForDoctors,
  deleteSymptom,
  analyzeSymptom,
  getAttachmentUrl,
} from "../controllers/symptomController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { uploadSymptomFiles } from "../config/s3.js";

const router = express.Router();

router.use(authMiddleware);

// Signed URL for viewing attachments — patients and doctors both need this
router.get(
  "/attachment-url",
  authorizeRoles("patient", "doctor"),
  getAttachmentUrl,
);

// Patient routes
router.post(
  "/add",
  authorizeRoles("patient"),
  uploadSymptomFiles.array("symptomFiles", 10),
  addSymptom,
);

router.post("/:id/analyze", authorizeRoles("patient"), analyzeSymptom);

router.put(
  "/:id",
  authorizeRoles("patient"),
  uploadSymptomFiles.array("symptomFiles", 10),
  updateSymptom,
);

router.get("/", authorizeRoles("patient"), getSymptoms);
router.get("/:id", authorizeRoles("patient"), getSymptomById);
router.delete("/:id", authorizeRoles("patient"), deleteSymptom);

// Doctor route - POST with authentication and authorization
router.post(
  "/doctorpatientsymptoms",
  authorizeRoles("doctor"),
  getSymptomsForDoctors,
);

export default router;
