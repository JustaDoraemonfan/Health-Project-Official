import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import {
  assignPatientToDoctor,
  getPatientsOfDoctor,
  unassignPatientFromDoctor,
} from "../controllers/doctorpatiendController.js";

const router = express.Router();

// CRUD operations - admin only
router
  .route("/")
  .post(authMiddleware, authorizeRoles("admin"), createDoctor)
  .get(authMiddleware, authorizeRoles("admin"), getDoctors);

router
  .route("/:id")
  .get(authMiddleware, authorizeRoles("admin", "doctor"), getDoctor)
  .put(authMiddleware, authorizeRoles("admin"), updateDoctor)
  .delete(authMiddleware, authorizeRoles("admin"), deleteDoctor);

// Assign and unassign patients
router
  .route("/assign")
  .post(authMiddleware, authorizeRoles("admin"), assignPatientToDoctor);

router
  .route("/unassign")
  .post(
    authMiddleware,
    authorizeRoles("admin", "doctor"),
    unassignPatientFromDoctor
  );

// Get all assigned patients of a doctor
router
  .route("/get-patients")
  .post(authMiddleware, authorizeRoles("admin", "doctor"), getPatientsOfDoctor);

export default router;
