import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const uploadProfilePhotoController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, "No photo uploaded", 400);
  }

  const userId = req.user.id;
  const userType = req.user.role;

  const photoURL = req.file.location;
  const photoKey = req.file.key;

  let Model = null;
  if (userType === "doctor") {
    Model = Doctor;
  } else if (userType === "patient") {
    Model = Patient;
  } else {
    return errorResponse(
      res,
      "Only patients and doctors can upload profile photos",
      403,
    );
  }

  const updated = await Model.findOneAndUpdate(
    { userId },
    { profilePhoto: photoURL, profilePhotoKey: photoKey },
    { new: true },
  );

  if (!updated) {
    return errorResponse(res, "User profile record not found", 404);
  }

  return successResponse(
    res,
    { photoURL },
    "Profile photo updated successfully",
  );
});
