import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import FWL from "../models/FWL.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getProfile = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  let profile;

  switch (role) {
    case "patient":
      profile = await Patient.findOne({ userId: id }).populate(
        "userId",
        "name email role",
      );
      break;
    case "doctor":
      profile = await Doctor.findOne({ userId: id }).populate(
        "userId",
        "name email role",
      );
      break;
    case "frontlineWorker":
      profile = await FWL.findOne({ userId: id }).populate(
        "userId",
        "name email role",
      );
      break;
    default:
      return errorResponse(res, "Invalid role", 400);
  }

  if (!profile) {
    return errorResponse(res, "Profile not found", 404);
  }

  return successResponse(res, profile, "Profile fetched successfully");
});
