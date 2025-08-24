import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import {
  getPatientDashboard,
  getDoctorDashboard,
  getFrontlineDashboard,
  getAdminDashboard,
} from "../controllers/Dashboards/dashboard.js";

const router = express.Router();

router.get(
  "/patient",
  authMiddleware,
  authorizeRoles("patient"),
  getPatientDashboard
);
router.get(
  "/doctor",
  authMiddleware,
  authorizeRoles("doctor"),
  getDoctorDashboard
);
router.get(
  "/frontline",
  authMiddleware,
  authorizeRoles("frontlineWorker"),
  getFrontlineDashboard
);
router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  getAdminDashboard
);

export default router;
