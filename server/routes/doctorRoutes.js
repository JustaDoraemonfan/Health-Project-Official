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
  getDoctorsByLocation,
  setAvailability,
  getAvailability,
  submitVerification,
} from "../controllers/doctorController.js";
import {
  assignPatientToDoctor,
  getPatientsOfDoctor,
  unassignPatientFromDoctor,
} from "../controllers/doctorpatiendController.js";
import { upload } from "../config/s3.js";

const router = express.Router();

// CRUD operations - admin only
router
  .route("/")
  .post(authMiddleware, authorizeRoles("admin"), createDoctor)
  .get(authMiddleware, authorizeRoles("admin", "patient"), getDoctors);

router.post(
  "/verify",
  authMiddleware, // Your auth middleware
  upload.fields([
    { name: "nmcCertificate", maxCount: 1 },
    { name: "mbbsCertificate", maxCount: 1 },
    { name: "internshipCertificate", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  submitVerification
);
// Doctor availability routes
router
  .route("/availability")
  .post(authMiddleware, authorizeRoles("doctor"), setAvailability) // ✅ doctor updates availability
  .get(authMiddleware, authorizeRoles("doctor"), getAvailability); // ✅ doctor views their own availability

// (Optional) public endpoint for patients to see a specific doctor’s schedule
// router.get("/:id/availability", getDoctorAvailabilityById);

// Get all assigned patients of a doctor
router
  .route("/get-patients")
  .get(
    authMiddleware,
    authorizeRoles("patient", "doctor"),
    getPatientsOfDoctor
  );

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
