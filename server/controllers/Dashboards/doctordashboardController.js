import Doctor from "../../models/Doctor.js";
import Appointment from "../../models/Appointment.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";

// Doctor Dashboard
const getDoctorDashboard = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user.id });

  if (!doctor) {
    return errorResponse(res, "Doctor record not found", 404);
  }

  // Get today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysAppointments = await Appointment.countDocuments({
    doctor: doctor._id,
    appointmentDate: { $gte: today, $lt: tomorrow },
    status: "scheduled",
  });

  return successResponse(res, {
    message: `Welcome to the doctor dashboard, ${req.user.name}!`,
    role: req.user.role,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    doctor: {
      id: doctor._id,
      specialization: doctor.specialization,
      location: doctor.location,
      isAvailable: doctor.isAvailable,
    },
    todaysAppointments,
  });
});

export default getDoctorDashboard;
