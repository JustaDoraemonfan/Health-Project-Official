import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Frontline from "../models/FWL.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse } from "../utils/response.js";

// Get public platform statistics — used on the landing page.
// Admin count is intentionally excluded: internal headcount has no place
// in a public-facing endpoint. Doctor count is scoped to verified only.
export const getStats = asyncHandler(async (req, res) => {
  const [totalPatients, verifiedDoctors, totalFrontline] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments({ "verification.status": "verified" }),
    Frontline.countDocuments(),
  ]);

  return successResponse(
    res,
    {
      patients: totalPatients,
      doctors: verifiedDoctors,
      frontline: totalFrontline,
    },
    "Stats fetched successfully",
  );
});
