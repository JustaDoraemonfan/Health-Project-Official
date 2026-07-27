import mongoose from "mongoose";

//Models
import Doctor from "../Models/Doctor.js";
import Patient from "../Models/Patient.js";

//Middleware
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

//Helper
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js";

//Interface
import {
  CreateDoctorRequest,
  UpdateDoctorRequest,
  SetAvailabilityRequest,
  SubmitVerificationRequest,
  MulterS3File,
} from "../types/request.js";

// Create a new doctor (admin only)
export const createDoctor = asyncHandler(async (req, res) => {
  const body = req.body as CreateDoctorRequest;

  const { userId, specialization } = body;

  if (!userId || !specialization) {
    return errorResponse(res, "User ID and specialization are required", 400);
  }

  const doctor = await Doctor.create(body);

  return successResponse(res, doctor, "Doctor created successfully", 201);
});

// Get all doctors
// Accepts optional ?status=verified query param so patient-facing calls
// only receive verified doctors — filtering belongs on the server, not the client.
export const getDoctors = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};

  const { status } = req.query;

  if (typeof status === "string") {
    filter["verification.status"] = status;
  }

  const doctors = await Doctor.find(filter)
    .populate("userId", "name email")
    .lean();

  return successResponse(res, doctors, "Doctors fetched successfully");
});

// Get a single doctor
export const getDoctor = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  const doctor = await Doctor.findById(req.params.id)
    .populate("patients", "name email")
    .lean();

  if (!doctor) {
    return errorResponse(res, "Doctor not found", 404);
  }

  return successResponse(res, doctor, "Doctor fetched successfully");
});

// Update a doctor (admin only)
export const updateDoctor = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  const updateData = {
    ...(req.body as UpdateDoctorRequest),
  };

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!doctor) return errorResponse(res, "Doctor not found", 404);

  return successResponse(res, doctor, "Doctor updated successfully");
});

// Delete a doctor (admin only)
export const deleteDoctor = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
    return errorResponse(res, "Invalid doctor ID", 400);
  }

  const doctor = await Doctor.findByIdAndDelete(req.params.id);

  if (!doctor) {
    return errorResponse(res, "Doctor not found", 404);
  }

  return successResponse(res, null, "Doctor deleted successfully");
});

// Get doctors by location (patient search)
export const getDoctorsByLocation = asyncHandler(async (req, res) => {
  const { location } = req.query;

  if (typeof location !== "string" || !location) {
    return errorResponse(res, "Location is required", 400);
  }

  const doctors = await Doctor.find({
    location: { $regex: new RegExp(location, "i") }, // case-insensitive partial match
  }).populate("userId", "name email");

  if (doctors.length === 0) {
    return errorResponse(res, "No doctors found in this location", 404);
  }

  return successResponse(res, doctors, "Doctors fetched successfully");
});

// @desc Set or update doctor availability
// @route POST /api/doctors/availability
// @access Private (Doctor)
export const setAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body as SetAvailabilityRequest;

  if (!availability || !Array.isArray(availability)) {
    return errorResponse(res, "Availability must be an array", 400);
  }

  const doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor) {
    return errorResponse(res, "Doctor profile not found", 404);
  }

  doctor.availability = availability;
  await doctor.save();

  return successResponse(
    res,
    doctor.availability,
    "Availability updated successfully",
    200,
  );
});

// @desc Get doctor availability
// @route GET /api/doctors/availability
// @access Private (Doctor)
export const getAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id }).select(
    "availability",
  );

  if (!doctor) {
    return errorResponse(res, "Doctor profile not found", 404);
  }

  return successResponse(
    res,
    doctor.availability,
    "Availability fetched successfully",
    200,
  );
});

// @desc Submit verification documents
// @route POST /api/doctors/verify
// @access Private (Doctor)
export const submitVerification = asyncHandler(async (req, res) => {
  if (!req.user) {
    return errorResponse(res, "Unauthorized", 401);
  }

  const { nmcRegistrationNumber } = req.body as SubmitVerificationRequest;

  if (!nmcRegistrationNumber) {
    return errorResponse(res, "NMC Registration Number is required", 400);
  }

  // upload.fields() (config/s3.ts) populates req.files as a dict keyed by
  // field name, each value an array of multer-s3 files.
  const files = req.files as Record<string, MulterS3File[]> | undefined;

  if (!files || Object.keys(files).length === 0) {
    return errorResponse(res, "No files uploaded", 400);
  }

  const requiredFiles = [
    "nmcCertificate",
    "mbbsCertificate",
    "internshipCertificate",
    "aadharCard",
  ] as const;

  const missingFiles = requiredFiles.filter((field) => !files[field]);

  if (missingFiles.length > 0) {
    return errorResponse(
      res,
      `Missing required files: ${missingFiles.join(", ")}`,
      400,
    );
  }

  // Extract file URLs from uploaded files
  const evidence = {
    nmcCertificate: files.nmcCertificate[0].location,
    mbbsCertificate: files.mbbsCertificate[0].location,
    internshipCertificate: files.internshipCertificate[0].location,
    aadharCard: files.aadharCard[0].location,
  };

  const now = nowInIST(); // Use IST time

  // Update doctor with verification data
  const updatedDoctor = await Doctor.findOneAndUpdate(
    { userId: req.user._id },
    {
      verification: {
        status: "pending",
        appliedAt: now, // Store the IST-aware timestamp
        nmcRegistrationNumber,
        evidence,
      },
    },
    { new: true },
  );

  if (!updatedDoctor) {
    return errorResponse(res, "Doctor not found", 404);
  }

  const responseData = {
    verificationStatus: updatedDoctor.verification.status,
    appliedAt: updatedDoctor.verification.appliedAt,
    nmcRegistrationNumber,
    documentsUploaded: Object.keys(evidence),
  };

  return successResponse(
    res,
    responseData,
    "Verification submitted successfully",
  );
});
