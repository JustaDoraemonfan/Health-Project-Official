import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";

// Patient Dashboard
const getPatientDashboard = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ email: req.user.email });

  if (!patient) {
    return errorResponse(res, "Patient record not found", 404);
  }

  // Get upcoming appointments count
  const upcomingAppointments = await Appointment.countDocuments({
    patient: patient._id,
    appointmentDate: { $gte: new Date() },
    status: "scheduled",
  });

  // Get recent appointments for health status calculation
  const recentAppointments = await Appointment.find({
    patient: patient._id,
    appointmentDate: {
      $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    },
    status: "completed",
  });

  // Simple health status logic
  let healthStatus = "Healthy";
  if (recentAppointments.length === 0 && upcomingAppointments === 0) {
    healthStatus = "Check-up Due";
  }

  return successResponse(res, {
    message: `Welcome to the patient dashboard, ${req.user.name}!`,
    role: req.user.role,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    patient: {
      id: patient._id,
      age: patient.age,
      gender: patient.gender,
      medicalHistory: patient.medicalHistory,
    },
    healthStatus,
    upcomingAppointments,
    recentAppointments: recentAppointments.length,
  });
});
export default getPatientDashboard;
