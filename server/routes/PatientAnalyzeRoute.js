import { analyzePatientProfile } from "../controllers/PatientAnalyzeController.js";
import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:patientId/analyze",
  authMiddleware,
  authorizeRoles("doctor"),
  analyzePatientProfile
);
export default router;
