// routes/appointmentRoutes.js
import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointments,
  getPastAppointments,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  getAppointmentsByDateRange,
  getAppointmentStats,
} from "../controllers/appointmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Appointment Routes
router
  .route("/")
  .post(authMiddleware, createAppointment) // Create appointment
  .get(authMiddleware, getAppointments); // Get all appointments

// Upcoming & Past
router.get("/upcoming", authMiddleware, getUpcomingAppointments);
router.get("/past", authMiddleware, getPastAppointments);

// Date range & Stats
router.get("/date-range", authMiddleware, getAppointmentsByDateRange);
router.get("/stats", authMiddleware, getAppointmentStats);

// Single appointment
router
  .route("/:id")
  .get(authMiddleware, getAppointmentById) // Get single appointment by ID
  .put(authMiddleware, updateAppointment) // Update appointment
  .delete(authMiddleware, deleteAppointment); // Delete appointment

// Appointment actions
router.patch("/:id/cancel", authMiddleware, cancelAppointment);
router.patch("/:id/confirm", authMiddleware, confirmAppointment);
router.patch("/:id/complete", authMiddleware, completeAppointment);

export default router;
