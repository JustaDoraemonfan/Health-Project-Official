// routes/appointmentRoutes.js
import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointments,
} from "../controllers/appointmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Appointment Routes
router
  .route("/")
  .post(createAppointment) // Create appointment
  .get(getAppointments); // Get all appointments
router.get("/upcoming", authMiddleware, getUpcomingAppointments);

router
  .route("/:id")
  .get(getAppointmentById) // Get single appointment by ID
  .put(updateAppointment) // Update appointment
  .delete(deleteAppointment); // Delete appointment

export default router;
