import Patient from "../Models/Patient.js";

//Middleware
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

//Interface
import type { CreatePatientRequest } from "../types/request.js";

export const createPatient = asyncHandler(async (req, res) => {
  const { userId, age, gender } = req.body as CreatePatientRequest;
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

export const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find()
    .populate("assignedDoctor", "name email")
    .lean();
  return successResponse(res, patients, "Patients fetched successfully");
});

export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate("assignedDoctor", "name email")
    .lean();
  if (!patient) return errorResponse(res, "Patient not found", 404);
  return successResponse(res, patient, "Patient fetched successfully");
});

export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).lean();
  if (!patient) return errorResponse(res, "Patient not found", 404);
  return successResponse(res, patient, "Patient updated successfully");
});

export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id).lean();
  if (!patient) return errorResponse(res, "Patient not found", 404);
  return successResponse(res, patient, "Patient deleted successfully");
});
