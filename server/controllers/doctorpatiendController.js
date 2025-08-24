import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Assign a patient to a doctor
export const assignPatientToDoctor = asyncHandler(async (req, res) => {
  const { doctorId, patientId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(doctorId) ||
    !mongoose.Types.ObjectId.isValid(patientId)
  ) {
    return errorResponse(res, "Invalid doctorId or patientId", 400);
  }

  const doctor = await Doctor.findById(doctorId);
  const patient = await Patient.findById(patientId);

  if (!doctor || !patient) {
    return errorResponse(res, "Doctor or Patient not found", 404);
  }

  if (!doctor.patients.includes(patient._id)) doctor.patients.push(patient._id);
  if (!patient.assignedDoctor) patient.assignedDoctor = doctor._id;

  await doctor.save();
  await patient.save();

  return successResponse(
    res,
    { doctor, patient },
    `Patient ${patient.name} assigned to Doctor ${doctor.name}`
  );
});

// Get all the assigned patients of a doctor
export const getPatientsOfDoctor = asyncHandler(async (req, res) => {
  const doctorId = req.body.doctorId?.trim();
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return errorResponse(res, "Invalid doctorId", 400);
  }

  const doctor = await Doctor.findById(doctorId).populate("patients");
  if (!doctor) return errorResponse(res, "Doctor not found", 404);

  return successResponse(
    res,
    { doctor: doctor.name, patients: doctor.patients },
    "Patients of doctor fetched successfully"
  );
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

  const doctor = await Doctor.findById(doctorId);
  const patient = await Patient.findById(patientId);

  if (!doctor || !patient) {
    return errorResponse(res, "Doctor or Patient not found", 404);
  }

  doctor.patients = doctor.patients.filter((p) => p.toString() !== patientId);

  if (patient.assignedDoctor?.toString() === doctorId) {
    patient.assignedDoctor = null;
  }

  await doctor.save();
  await patient.save();

  return successResponse(
    res,
    { doctor, patient },
    `Patient ${patient.name} unassigned from Doctor ${doctor.name}`
  );
});
