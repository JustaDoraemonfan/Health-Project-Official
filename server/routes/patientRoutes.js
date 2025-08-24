import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, authorizeRoles("admin", "frontline"), createPatient)
  .get(authMiddleware, authorizeRoles("admin", "doctor"), getPatients);

router
  .route("/:id")
  .get(authMiddleware, authorizeRoles("admin", "doctor"), getPatient)
  .put(authMiddleware, authorizeRoles("admin", "frontline"), updatePatient)
  .delete(authMiddleware, authorizeRoles("admin"), deletePatient);

export default router;
