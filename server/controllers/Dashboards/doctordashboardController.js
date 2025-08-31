import Doctor from "../../models/Doctor.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";

// Doctor Dashboard
const getDoctorDashboard = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user.id });
  if (!doctor) {
    return errorResponse(res, "Doctor record not found", 404);
  }

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
      age: doctor.age,
      gender: doctor.gender,
      medicalHistory: doctor.medicalHistory,
    },
  });
});
export default getDoctorDashboard;
