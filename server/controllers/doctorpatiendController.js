import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Assign a patient to a doctor
export const assignPatientToDoctor = async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;

    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    // Prevent duplicates
    if (!doctor.patients.includes(patient._id)) {
      doctor.patients.push(patient._id);
    }

    // Always overwrite patient assignment
    patient.assignedDoctor = doctor._id;

    await doctor.save();
    await patient.save();

    res.status(200).json({
      message: "Patient assigned successfully",
      doctor,
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all the assigned patients of a doctor
export const getPatientsOfDoctor = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id);
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
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Patients fetched successfully",
      patients: doctor.patients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
