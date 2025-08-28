import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

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

  const doctor = await Doctor.findById(req.params.id)
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
