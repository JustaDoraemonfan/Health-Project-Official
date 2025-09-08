import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Notes from "../models/Notes.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createNote = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.user.id; // assuming doctor is logged in
    const { patientId, title, content, category, priority } = req.body;

    const note = await Notes.create({
      doctorId,
      patientId,
      title,
      content,
      category,
      priority,
    });

    return successResponse(res, note, "Note created successfully", 201);
  } catch (err) {
    return errorResponse(res, "Failed to create note", 500, err.message);
  }
});

export const getPatientNotes = asyncHandler(async (req, res) => {
  const { id: patientId } = req.user; // patient logged in

  const notes = await Notes.find({ patientId })
    .populate("doctorId", "name email role") // optional: show doctor details
    .sort({ createdAt: -1 });

  return successResponse(res, notes, "Patient notes fetched successfully");
});

// Get all notes created by a doctor
export const getDoctorNotes = asyncHandler(async (req, res) => {
  const { id: doctorId } = req.user; // doctor logged in

  const notes = await Notes.find({ doctorId })
    .populate("patientId", "name email role")
    .sort({ createdAt: -1 });

  return successResponse(res, notes, "Doctor notes fetched successfully");
});

// Mark a note as read (patient action)
export const markNoteAsRead = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;

  const note = await Notes.findByIdAndUpdate(
    noteId,
    { isRead: true },
    { new: true }
  );

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, note, "Note marked as read");
});

// Acknowledge a note (patient action)
export const acknowledgeNote = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;

  const note = await Notes.findByIdAndUpdate(
    noteId,
    { acknowledged: true },
    { new: true }
  );

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, note, "Note acknowledged successfully");
});

// Update a note (doctor only)
export const updateNote = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;
  const { title, content, category, priority } = req.body;

  const note = await Notes.findByIdAndUpdate(
    noteId,
    { title, content, category, priority },
    { new: true, runValidators: true }
  );

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, note, "Note updated successfully");
});

// Delete a note (doctor only)
export const deleteNote = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;

  const note = await Notes.findByIdAndDelete(noteId);

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, null, "Note deleted successfully");
});
