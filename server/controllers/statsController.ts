//Models
import Patient from "../Models/Patient.js";
import Doctor from "../Models/Doctor.js";

//Middleware
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse } from "../utils/response.js";

export const getStats = asyncHandler(async (req, res) => {
  const [totalPatients, verifiedDoctors] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments({ "verification.status": "verified" }),
  ]);

  return successResponse(
    res,
    {
      patients: totalPatients,
      doctors: verifiedDoctors,
    },
    "Stats fetched successfully",
  );
});
