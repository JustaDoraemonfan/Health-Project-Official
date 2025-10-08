// controllers/reminderController.js
import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import Reminder from "../../models/Medication/Reminder.js";

export const createReminder = asyncHandler(async (req, res) => {
  const {
    medicine,
    dosage,
    frequency,
    times, // 'status' field removed as it does not exist in the ReminderSchema
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
    intervalHours,
    startDate,
    endDate,
    timezone,
    notes,
  });

  return successResponse(res, reminder, "Reminder Created Successfully", 201);
});

export const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  const todayKey = new Date().toISOString().split("T")[0];
  const yesterdayKey = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  reminders.forEach((reminder) => {
    // Only mark yesterday as missed if it was 'upcoming'
    if (reminder.dailyStatus?.get(yesterdayKey) === "upcoming") {
      reminder.dailyStatus.set(yesterdayKey, "missed");
      reminder.markModified("dailyStatus"); // Important for Mongoose maps
    }

    // Optionally: set today as 'today' if no status exists
    if (!reminder.dailyStatus?.get(todayKey)) {
      reminder.dailyStatus.set(todayKey, "missed");
      reminder.markModified("dailyStatus");
    }
  });

  // Save all updates at once
  await Promise.all(reminders.map((r) => r.save()));

  return successResponse(res, reminders);
});

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

export const updateReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  } // Object.assign is fine here, Mongoose will only update fields defined in the schema

  Object.assign(reminder, req.body);
  await reminder.save();

  return successResponse(res, reminder);
});

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

export const markAsTaken = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  } // Use the provided date or default to the current date in "YYYY-MM-DD" format

  const dateKey = new Date().toISOString().split("T")[0]; // Update dailyStatus map

  reminder.dailyStatus.set(dateKey, "taken");

  await reminder.save();

  return successResponse(res, reminder, `Marked as taken for ${dateKey}`);
});
