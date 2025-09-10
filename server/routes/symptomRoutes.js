// routes/symptomRoutes.js - Updated
import express from "express";
import {
  addSymptom,
  updateSymptom,
  getSymptoms,
  getSymptomById,
  deleteSymptom,
} from "../controllers/symptomController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { symptomUpload } from "../middleware/multer.js"; // Use symptom-specific upload

const router = express.Router();

router.use(authMiddleware);

// Use symptom-specific multer configuration
router.post(
  "/",
  authorizeRoles("patient"),
  symptomUpload.array("symptomFiles", 10), // symptom-specific upload
  addSymptom
);

router.put(
  "/:id",
  authorizeRoles("patient"),
  symptomUpload.array("symptomFiles", 10), // symptom-specific upload
  updateSymptom
);

router.get("/", authorizeRoles("patient"), getSymptoms);
router.get("/:id", authorizeRoles("patient"), getSymptomById);
router.delete("/:id", authorizeRoles("patient"), deleteSymptom);

export default router;
