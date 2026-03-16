import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Notes from "../models/Notes.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Strip all HTML tags from a string, leaving only plain text.
// This prevents stored XSS — malicious <script> or event-handler tags
// written into note fields are neutralised before they reach the database.
const stripHtml = (str) =>
  typeof str === "string" ? str.replace(/<[^>]*>/g, "").trim() : str;

export const createNote = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId, title, content, category, priority } = req.body;

    const note = await Notes.create({
      doctorId,
      patientId,
      title: stripHtml(title),
      content: stripHtml(content),
      category,
      priority,
    });

    return successResponse(res, note, "Note created successfully", 201);
  } catch (err) {
    return errorResponse(res, "Failed to create note", 500, err.message);
  }
});

export const getPatientNotes = asyncHandler(async (req, res) => {
  const { id: patientId } = req.user;

  const notes = await Notes.find({ patientId })
    .populate("doctorId", "name email role")
    .sort({ createdAt: -1 });

  return successResponse(res, notes, "Patient notes fetched successfully");
});

export const getDoctorNotes = asyncHandler(async (req, res) => {
  const { id: doctorId } = req.user;

  const notes = await Notes.find({ doctorId })
    .populate("patientId", "name email role")
    .sort({ createdAt: -1 });

  return successResponse(res, notes, "Doctor notes fetched successfully");
});

export const markNoteAsRead = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;

  const note = await Notes.findByIdAndUpdate(
    noteId,
    { isRead: true },
    { new: true },
  );

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, note, "Note marked as read");
});

export const acknowledgeNote = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;

  const note = await Notes.findByIdAndUpdate(
    noteId,
    { acknowledged: true },
    { new: true },
  );

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, note, "Note acknowledged successfully");
});

export const updateNote = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;
  const { title, content, category, priority } = req.body;

  const note = await Notes.findByIdAndUpdate(
    noteId,
    {
      title: stripHtml(title),
      content: stripHtml(content),
      category,
      priority,
    },
    { new: true, runValidators: true },
  );

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, note, "Note updated successfully");
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { id: noteId } = req.params;

  const note = await Notes.findByIdAndDelete(noteId);

  if (!note) {
    return errorResponse(res, "Note not found", 404);
  }

  return successResponse(res, null, "Note deleted successfully");
});
