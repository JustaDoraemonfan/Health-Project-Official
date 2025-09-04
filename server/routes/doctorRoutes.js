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
  getDoctorsByLocation, // ✅ Import new controller
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
  .get(authMiddleware, authorizeRoles("admin", "patient"), getDoctors);

// Get all assigned patients of a doctor
router
  .route("/get-patients")
  .get(authMiddleware, authorizeRoles("admin", "doctor"), getPatientsOfDoctor);

// Search doctors by location (accessible to patients too)
router.get(
  "/search",
  authMiddleware,
  authorizeRoles("patient", "admin", "doctor"),
  getDoctorsByLocation
);

router
  .route("/:id")
  .get(authMiddleware, authorizeRoles("admin", "doctor"), getDoctor)
  .put(authMiddleware, authorizeRoles("admin", "doctor"), updateDoctor)
  .delete(authMiddleware, authorizeRoles("admin"), deleteDoctor);

// Assign and unassign patients
router
  .route("/assign")
  .post(
    authMiddleware,
    authorizeRoles("admin", "doctor"),
    assignPatientToDoctor
  );

router
  .route("/unassign")
  .post(
    authMiddleware,
    authorizeRoles("admin", "doctor"),
    unassignPatientFromDoctor
  );

export default router;
