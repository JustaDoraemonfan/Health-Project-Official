// controllers/reminderController.js
import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import Reminder from "../../models/Medication/Reminder.js";

/**
 * @desc    Create a new reminder
 * @route   POST /api/reminders
 * @access  Private
 */
export const createReminder = asyncHandler(async (req, res) => {
  const {
    medicine,
    dosage,
    frequency,
    times,
    status,
    intervalHours,
    startDate,
    endDate,
    timezone,
    notes,
  } = req.body;

  if (!medicine || !frequency) {
    return errorResponse(res, "Medicine and frequency are required", 400);
  }

  const reminder = await Reminder.create({
    userId: req.user._id,
    medicine,
    dosage,
    frequency,
    times,
    status,
    intervalHours,
    startDate,
    endDate,
    timezone,
    notes,
  });

  return successResponse(res, reminder, "Reminder Created Successfully", 201);
});

/**
 * @desc    Get all reminders for a user
 * @route   GET /api/reminders
 * @access  Private
 */
export const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  return successResponse(res, reminders);
});

/**
 * @desc    Get a single reminder by ID
 * @route   GET /api/reminders/:id
 * @access  Private
 */
export const getReminderById = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  }

  return successResponse(res, reminder);
});

/**
 * @desc    Update a reminder
 * @route   PUT /api/reminders/:id
 * @access  Private
 */
export const updateReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  }

  Object.assign(reminder, req.body);
  await reminder.save();

  return successResponse(res, reminder);
});

/**
 * @desc    Delete a reminder
 * @route   DELETE /api/reminders/:id
 * @access  Private
 */
export const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  }

  await reminder.deleteOne();

  return successResponse(res, null, 200, "Reminder deleted successfully");
});
