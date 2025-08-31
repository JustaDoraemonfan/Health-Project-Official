import Patient from "../../models/Patient.js";
// import Appointment from "../../models/Appointment.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";

// Patient Dashboard
const getPatientDashboard = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ userId: req.user.id });
  if (!patient) {
    return errorResponse(res, "Patient record not found", 404);
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
  });
});
export default getPatientDashboard;
