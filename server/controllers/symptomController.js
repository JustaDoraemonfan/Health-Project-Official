import Symptom from "../models/Symptom.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * @desc    Add a new symptom
 * @route   POST /api/symptoms
 * @access  Private (Patient)
 */
export const addSymptom = asyncHandler(async (req, res) => {
  const { description, severity, onsetDate, notes, category } = req.body;
  const patientId = req.user.id; // req.user set by auth middleware

  if (!description || !severity) {
    return errorResponse(res, "Description and severity are required", 400);
  }

  const symptom = await Symptom.create({
    patient: patientId,
    description,
    severity,
    onsetDate,
    notes,
    category,
  });

  return successResponse(res, symptom, "Symptom added successfully", 201);
});

/**
 * @desc    Update an existing symptom
 * @route   PUT /api/symptoms/:id
 * @access  Private (Patient)
 */
export const updateSymptom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patientId = req.user.id;

  const symptom = await Symptom.findOne({ _id: id, patient: patientId });
  if (!symptom) {
    return errorResponse(res, "Symptom not found", 404);
  }

  const updates = req.body;
  Object.assign(symptom, updates);
  await symptom.save();

  return successResponse(res, symptom, "Symptom updated successfully", 200);
});

/**
 * @desc    Get all symptoms for a patient
 * @route   GET /api/symptoms
 * @access  Private (Patient)
 */
export const getSymptoms = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const symptoms = await Symptom.find({ patient: patientId }).sort({
    createdAt: -1,
  });

  return successResponse(res, symptoms, "Symptoms retrieved successfully", 200);
});

/**
 * @desc    Get a single symptom
 * @route   GET /api/symptoms/:id
 * @access  Private (Patient)
 */
export const getSymptomById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patientId = req.user.id;

  const symptom = await Symptom.findOne({ _id: id, patient: patientId });
  if (!symptom) {
    return errorResponse(res, "Symptom not found", 404);
  }

  return successResponse(res, symptom, "Symptom retrieved successfully", 200);
});

/**
 * @desc    Delete a symptom
 * @route   DELETE /api/symptoms/:id
 * @access  Private (Patient)
 */
export const deleteSymptom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patientId = req.user.id;

  const symptom = await Symptom.findOneAndDelete({
    _id: id,
    patient: patientId,
  });
  if (!symptom) {
    return errorResponse(res, "Symptom not found", 404);
  }

  return successResponse(res, {}, "Symptom deleted successfully", 200);
});
