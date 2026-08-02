import type { RequestHandler } from "express";

// Models
import Doctor from "../Models/Doctor.js";
import Patient from "../Models/Patient.js";

// Middleware
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const uploadProfilePhotoController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      return errorResponse(res, "No photo uploaded", 400);
    }

    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const userId = req.user.id;
    const userType = req.user.role;

    const photoURL = req.file.location;
    const photoKey = req.file.key;

    if (userType === "doctor") {
      const updated = await Doctor.findOneAndUpdate(
        { userId },
        { profilePhoto: photoURL, profilePhotoKey: photoKey },
        { new: true },
      );

      if (!updated) {
        return errorResponse(res, "User profile record not found", 404);
      }
    } else if (userType === "patient") {
      const updated = await Patient.findOneAndUpdate(
        { userId },
        { profilePhoto: photoURL, profilePhotoKey: photoKey },
        { new: true },
      );

      if (!updated) {
        return errorResponse(res, "User profile record not found", 404);
      }
    } else {
      return errorResponse(
        res,
        "Only patients and doctors can upload profile photos",
        403,
      );
    }
    return successResponse(
      res,
      { photoURL },
      "Profile photo updated successfully",
    );
  },
);
