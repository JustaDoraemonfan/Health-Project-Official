import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js"; // Import IST constant

// Helper function to get the current time in IST

// Create a new doctor (admin only)
export const createDoctor = asyncHandler(async (req, res) => {
  const { name, email, specialization } = req.body;

  if (!name || !email || !specialization) {
    return errorResponse(
      res,
      "Name, email, and specialization are required",
      400
    );
  }

  const doctor = await Doctor.create(req.body);
  return successResponse(res, doctor, "Doctor created successfully", 201);
});

// Get all doctors (admin only)
export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find()
    .populate("patients", "name email") // patients -> name, email
    .populate("userId", "name email") // doctor (userId) -> name, email
    .lean();

  return successResponse(res, doctors, "Doctors fetched successfully");
});

// Get a single doctor
export const getDoctor = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  const doctor = await Doctor.findById(req..id)
    .populate("patients", "name email")
    .lean();

  if (!doctor) return errorResponse(res, "Doctor not found", 404);

  return successResponse(res, doctor, "Doctor fetched successfully");
});

// Update a doctor (admin only)
export const updateDoctor = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  // Prevent updating sensitive fields like password if you add authentication later
  const updateData = { ...req.body };
  delete updateData.password;

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!doctor) return errorResponse(res, "Doctor not found", 404);

  return successResponse(res, doctor, "Doctor updated successfully");
});

// Delete a doctor (admin only)
export const deleteDoctor = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return errorResponse(res, "Doctor not found", 404);

  return successResponse(res, doctor, "Doctor deleted successfully");
});

// Get doctors by location (patient search)
export const getDoctorsByLocation = asyncHandler(async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return errorResponse(res, "Location is required", 400);
  }

  const doctors = await Doctor.find({
    location: { $regex: new RegExp(location, "i") }, // case-insensitive partial match
  }).populate("userId", "name email");
  // .populate("patients", "name email") // optional, only if you want to show linked patients
  // .lean();

  if (doctors.length === 0) {
    return errorResponse(res, "No doctors found in this location", 404);
  }

  return successResponse(res, doctors, "Doctors fetched successfully");
});

// @desc Set or update doctor availability
// @route POST /api/doctors/availability
// @access Private (Doctor)
export const setAvailability = asyncHandler(async (req, res) => {
  const userId = req.user.id; // assuming authentication middleware sets req.user
  const { availability } = req.body;

  if (!availability || !Array.isArray(availability)) {
    return errorResponse(res, "Availability must be an array", 400);
  }

  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    return errorResponse(res, "Doctor profile not found", 404);
  }

  doctor.availability = availability;
  await doctor.save();

  return successResponse(
    res,
    doctor.availability,
    "Availability updated successfully",
    200
  );
});

// @desc Get doctor availability
// @route GET /api/doctors/availability
// @access Private (Doctor)
export const getAvailability = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const doctor = await Doctor.findOne({ userId }).select("availability");
  if (!doctor) {
    return errorResponse(res, "Doctor profile not found", 404);
  }

  return successResponse(
    res,
    doctor.availability,
    "Availability fetched successfully",
    200
  );
});

// @desc Submit verification documents
// @route POST /api/doctors/submit-verification
// @access Private (Doctor)
export const submitVerification = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return errorResponse(res, "Unauthorized", 401);
  }

  const doctorId = req.user.id;
  const { nmcRegistrationNumber } = req.body;

  // Validate registration number
  if (!nmcRegistrationNumber) {
    return errorResponse(res, "NMC Registration Number is required", 400);
  }

  // Check if all files are uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return errorResponse(res, "No files uploaded", 400);
  }

  // Validate all required files are present
  const requiredFiles = [
    "nmcCertificate",
    "mbbsCertificate",
    "internshipCertificate",
    "aadharCard",
  ];
  const missingFiles = requiredFiles.filter((field) => !req.files[field]);

  if (missingFiles.length > 0) {
    return errorResponse(
      res,
      `Missing required files: ${missingFiles.join(", ")}`,
      400
    );
  }

  // Extract file URLs from uploaded files
  const evidence = {
    nmcCertificate: req.files.nmcCertificate[0].location,
    mbbsCertificate: req.files.mbbsCertificate[0].location,
    internshipCertificate: req.files.internshipCertificate[0].location,
    aadharCard: req.files.aadharCard[0].location,
  };

  const now = nowInIST(); // Use IST time

  // Update doctor with verification data
  const updatedDoctor = await Doctor.findOneAndUpdate(
    { userId: doctorId },
    {
      verification: {
        status: "pending",
        appliedAt: now, // Store the IST-aware timestamp
        nmcRegistrationNumber,
        evidence,
      },
    },
    { new: true }
  );

  if (!updatedDoctor) {
    return errorResponse(res, "Doctor not found", 404);
  }

  const responseData = {
    verificationStatus: updatedDoctor.verification.status,
    appliedAt: updatedDoctor.verification.appliedAt, // Return the stored timestamp
    nmcRegistrationNumber,
    documentsUploaded: Object.keys(evidence),
  };

  return successResponse(
    res,
    responseData,
    "Verification submitted successfully"
  );
});
