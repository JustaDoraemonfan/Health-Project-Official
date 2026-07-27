import Patient from "../Models/Patient.js";
import Doctor from "../Models/Doctor.js";
import Admin from "../Models/Admin.js";

//Midlleware
import asyncHandler from "../middleware/asyncHandler.js";

//Utils
import { successResponse, errorResponse } from "../utils/response.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return errorResponse(res, "User not found", 401);
  }
  const userId = req.user._id;
  const userRole = req.user.role;

  switch (userRole) {
    case "doctor": {
      const doctor = await Doctor.findOne({ userId })
        .populate("userId", "name email role")
        .select("-patients -appointments");

      if (!doctor) {
        return errorResponse(res, "Doctor Not Found", 401);
      }

      return successResponse(res, {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: "doctor",
        doctorProfile: doctor,
      });
    }
    case "patient": {
      const patient = await Patient.findOne({ userId })
        .populate("userId", "name email role")
        .populate({
          path: "assignedDoctor",
          select: "userId specialization experience consultationFee rating",
          populate: { path: "userId", select: "name email" },
        })
        .select("-symptoms");

      if (!patient) {
        return errorResponse(res, "Patient Not Found", 401);
      }

      return successResponse(res, {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: "patient",
        patientProfile: patient,
      });
    }
    case "admin": {
      const admin = await Admin.findOne({ userId })
        .populate("userId", "name email role")
        .populate({
          path: "handledVerifications.doctor",
          select: "userId specialization verification.status",
          populate: { path: "userId", select: "name email" },
        })
        .select("-auditTrail");
      if (!admin) {
        return errorResponse(res, "Admin Not Found", 401);
      }
      return successResponse(res, {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: "admin",
        adminProfile: admin,
      });
    }
    default:
      return errorResponse(res, "Invalid user role", 400);
  }
});
