import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Assign a patient to a doctor
export const assignPatientToDoctor = asyncHandler(async (req, res) => {
  const { doctorId, patientId } = req.body;

  const doctor = await Doctor.findOne({ userId: doctorId });
  const patient = await Patient.findOne({ userId: patientId });

  if (!doctor || !patient) {
    return errorResponse(res, "Doctor or patient not found", 404);
  }

  // Prevent duplicates
  if (!doctor.patients.includes(patient._id)) {
    doctor.patients.push(patient._id);
  }

  // Always overwrite patient assignment
  patient.assignedDoctor = doctor._id;

  await doctor.save();
  await patient.save();

  return successResponse(
    res,
    { doctor, patient },
    "Patient assigned successfully",
  );
});

// Get all the assigned patients of a doctor
export const getPatientsOfDoctor = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const doctor = await Doctor.findOne({ userId: id }).populate({
    path: "patients",
    model: "Patient",
    populate: {
      path: "userId",
      model: "User",
      select: "name email role",
    },
  });

  if (!doctor) {
    return errorResponse(res, "Doctor not found", 404);
  }

  return successResponse(res, doctor.patients, "Patients fetched successfully");
});

// Unassign any patient from a doctor
export const unassignPatientFromDoctor = asyncHandler(async (req, res) => {
  const { doctorId, patientId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(doctorId) ||
    !mongoose.Types.ObjectId.isValid(patientId)
  ) {
    return errorResponse(res, "Invalid doctorId or patientId", 400);
  }

  const doctor = await Doctor.findOne({ userId: doctorId });
  const patient = await Patient.findOne({ userId: patientId });

  if (!doctor || !patient) {
    return errorResponse(res, "Doctor or Patient not found", 404);
  }

  doctor.patients = doctor.patients.filter(
    (p) => p.toString() !== patient._id.toString(),
  );

  if (patient.assignedDoctor?.toString() === doctor._id.toString()) {
    patient.assignedDoctor = null;
  }

  await doctor.save();
  await patient.save();

  return successResponse(
    res,
    { doctor, patient },
    `Patient unassigned successfully`,
  );
});
