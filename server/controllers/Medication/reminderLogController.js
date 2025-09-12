import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import ReminderLog from "../../models/Medication/ReminderLog.js";

/**
 * @desc    Create a new reminder log (usually system-generated when reminder fires)
 * @route   POST /api/reminder-logs
 * @access  Private
 */
export const createReminderLog = asyncHandler(async (req, res) => {
  const { reminderId, scheduledFor, status, note } = req.body;

  if (!reminderId || !scheduledFor) {
    return errorResponse(res, "reminderId and scheduledFor are required", 400);
  }

  const log = await ReminderLog.create({
    reminderId,
    userId: req.user._id,
    scheduledFor,
    status,
    note,
  });

  return successResponse(res, log, 201);
});

/**
 * @desc    Get all logs for a user
 * @route   GET /api/reminder-logs
 * @access  Private
 */
export const getReminderLogs = asyncHandler(async (req, res) => {
  const logs = await ReminderLog.find({ userId: req.user._id })
    .populate("reminderId", "medicine dosage frequency times")
    .sort({ scheduledFor: -1 });

  return successResponse(res, logs);
});

/**
 * @desc    Get a single reminder log
 * @route   GET /api/reminder-logs/:id
 * @access  Private
 */
export const getReminderLogById = asyncHandler(async (req, res) => {
  const log = await ReminderLog.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate("reminderId", "medicine dosage");

  if (!log) {
    return errorResponse(res, "Reminder log not found", 404);
  }

  return successResponse(res, log);
});

/**
 * @desc    Update a log (e.g., user marks as "taken" or "skipped")
 * @route   PUT /api/reminder-logs/:id
 * @access  Private
 */
export const updateReminderLog = asyncHandler(async (req, res) => {
  const log = await ReminderLog.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!log) {
    return errorResponse(res, "Reminder log not found", 404);
  }

  const { status, note } = req.body;
  if (status) log.status = status;
  if (note) log.note = note;
  log.respondedAt = new Date();

  await log.save();

  return successResponse(res, log);
});
