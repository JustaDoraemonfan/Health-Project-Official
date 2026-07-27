//Models
import Patient from "../Models/Patient.js";
import Doctor from "../Models/Doctor.js";

//Middleware
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import Admin from "../Models/Admin.js";

export const getProfile = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;

  switch (role) {
    case "patient": {
      const profile = await Patient.findOne({ userId: _id }).populate(
        "userId",
        "name email role",
      );

      if (!profile) {
        return errorResponse(res, "Profile not found", 404);
      }

      return successResponse(res, profile, "Profile fetched successfully");
    }

    case "doctor": {
      const profile = await Doctor.findOne({ userId: _id }).populate(
        "userId",
        "name email role",
      );

      if (!profile) {
        return errorResponse(res, "Profile not found", 404);
      }

      return successResponse(res, profile, "Profile fetched successfully");
    }

    case "admin": {
      const profile = await Admin.findOne({ userId: _id }).populate(
        "userId",
        "name email role",
      );

      if (!profile) {
        return errorResponse(res, "Profile not found", 404);
      }

      return successResponse(res, profile, "Profile fetched successfully");
    }

    default:
      return errorResponse(res, "Invalid role", 400);
  }
});
