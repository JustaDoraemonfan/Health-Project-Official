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
import { CreateDoctorRequest, UpdateDoctorRequest } from "../types/request.js";

export const createDoctor = asyncHandler(async (req, res) => {
  const body = req.body as CreateDoctorRequest;

  const { userId, specialization } = body;

  if (!userId || !specialization) {
    return errorResponse(res, "User ID and specialization are required", 400);
  }

  const doctor = await Doctor.create(body);

  return successResponse(res, doctor, "Doctor created successfully", 201);
});

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
