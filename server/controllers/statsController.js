import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Frontline from "../models/FWL.js";
import Admin from "../models/Admin.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse } from "../utils/response.js";

// Get platform statistics
export const getStats = asyncHandler(async (req, res) => {
  const totalPatients = await Patient.countDocuments();
  const totalDoctors = await Doctor.countDocuments();
  const totalFrontline = await Frontline.countDocuments();
  const totalAdmin = await Admin.countDocuments();

  return successResponse(
    res,
    {
      patients: totalPatients,
      doctors: totalDoctors,
      frontline: totalFrontline,
      admin: totalAdmin,
    },
    "Stats fetched successfully"
  );
});
