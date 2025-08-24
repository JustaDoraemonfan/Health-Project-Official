import Patient from "../models/Patient.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Create a new patient (admin or frontline)
export const createPatient = asyncHandler(async (req, res) => {
  // Check if user exists first
  const { userId, age, gender } = req.body;
  const existingPatient = await Patient.findOne({ userId });
  if (existingPatient) {
    return errorResponse(res, "Patient for this user already exists", 409);
  }

  const patient = await Patient.create({
    userId,
    age,
    gender,
    assignedDoctor: null,
  });

  return successResponse(res, patient, "Patient created successfully", 201);
});

// Get all patients (doctor/admin)
export const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find()
    .populate("assignedDoctor", "name email")
    .lean();
  return successResponse(res, patients, "Patients fetched successfully");
});

// Get a single patient
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate("assignedDoctor", "name email")
    .lean();
  if (!patient) return errorResponse(res, "Patient not found", 404);
  return successResponse(res, patient, "Patient fetched successfully");
});

// Update a patient
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).lean();
  if (!patient) return errorResponse(res, "Patient not found", 404);
  return successResponse(res, patient, "Patient updated successfully");
});

// Delete a patient
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id).lean();
  if (!patient) return errorResponse(res, "Patient not found", 404);
  return successResponse(res, patient, "Patient deleted successfully");
});
