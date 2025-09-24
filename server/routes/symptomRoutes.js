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
} from "../controllers/symptomController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { symptomUpload } from "../middleware/multer.js";

const router = express.Router();

router.use(authMiddleware);

// Patient routes
router.post(
  "/add", // Changed path to avoid conflict
  authorizeRoles("patient"),
  symptomUpload.array("symptomFiles", 10),
  addSymptom
);

router.post("/:id/analyze", authorizeRoles("patient"), analyzeSymptom);

router.put(
  "/:id",
  authorizeRoles("patient"),
  symptomUpload.array("symptomFiles", 10),
  updateSymptom
);

router.get("/", authorizeRoles("patient"), getSymptoms);
router.get("/:id", authorizeRoles("patient"), getSymptomById);
router.delete("/:id", authorizeRoles("patient"), deleteSymptom);

// Doctor route - POST with authentication and authorization
router.post(
  "/doctorpatientsymptoms",
  authorizeRoles("doctor"),
  getSymptomsForDoctors
);

export default router;
