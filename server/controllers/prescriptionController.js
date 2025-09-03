import Prescription from "../models/Prescription.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// -----------------------------
// @desc    Upload prescription (Doctor only)
// @route   POST /api/prescriptions
// @access  Private (doctor)
// -----------------------------
export const uploadPrescription = asyncHandler(async (req, res) => {
  const { patientId } = req.body;

  // multer stores uploaded file in req.file
  if (!req.file) {
    return errorResponse(res, "No file uploaded", 400);
  }

  // Create prescription record
  const prescription = await Prescription.create({
    doctorId: req.user._id, // from authMiddleware
    patientId,
    fileUrl: `/uploads/prescriptions/${req.file.filename}`, // file path
  });

  return successResponse(
    res,
    prescription,
    "Prescription uploaded successfully",
    201
  );
});

// -----------------------------
// @desc    Get prescriptions for patient (Patient only)
// @route   GET /api/prescriptions/mine
// @access  Private (patient)
// -----------------------------
export const getMyPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({
    patientId: req.user._id,
  }).populate("doctorId", "name email"); // optional: show doctor info

  return successResponse(
    res,
    prescriptions,
    "Prescriptions fetched successfully"
  );
});

// -----------------------------
// @desc    Get prescriptions for a patient (Doctor only)
// @route   GET /api/prescriptions/:patientId
// @access  Private (doctor)
// -----------------------------
export const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const prescriptions = await Prescription.find({ patientId }).populate(
    "doctorId",
    "name email"
  );

  return successResponse(
    res,
    prescriptions,
    "Patient prescriptions fetched successfully"
  );
});
