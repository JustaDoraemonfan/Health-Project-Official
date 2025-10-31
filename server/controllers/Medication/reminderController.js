import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import Reminder from "../../models/Medication/Reminder.js";

// Import the new date functions
// This path assumes 'utils' is two levels up, parallel to 'middleware' and 'models'
import {
  IST_TIMEZONE,
  getISTDateKey,
  getMissedDates,
} from "../../utils/dateUtils.js";

export const createReminder = asyncHandler(async (req, res) => {
  const {
    medicine,
    dosage,
    frequency,
    times,
    intervalHours,
    startDate,
    endDate,
    timezone,
    notes,
    isActive,
  } = req.body;

  if (!medicine || !frequency) {
    return errorResponse(res, "Medicine and frequency are required", 400);
  }

  // Default timezone to IST if not provided
  const reminder = await Reminder.create({
    userId: req.user._id,
    medicine,
    dosage,
    frequency,
    times,
    intervalHours,
    startDate,
    endDate,
    timezone: timezone || IST_TIMEZONE,
    notes,
    isActive: isActive !== undefined ? isActive : true,
  });

  return successResponse(res, reminder, "Reminder Created Successfully", 201);
});

export const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  // Process each reminder to mark missed medications
  for (const reminder of reminders) {
    let hasChanges = false;
    const missedDates = getMissedDates(reminder); // From utils

    for (const dateKey of missedDates) {
      const currentStatus = reminder.dailyStatus?.get(dateKey);
      if (currentStatus !== "taken") {
        reminder.dailyStatus.set(dateKey, "missed");
        reminder.markModified("dailyStatus");
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await reminder.save();
    }
  }

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
  }

  Object.assign(reminder, req.body);
  if (!reminder.timezone) {
    reminder.timezone = IST_TIMEZONE; // From utils
  }

  await reminder.save();
  return successResponse(res, reminder, "Reminder updated successfully");
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
  return successResponse(res, null, "Reminder deleted successfully", 200);
});

export const markAsTaken = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  }

  const dateKey = getISTDateKey(); // From utils

  if (reminder.dailyStatus?.get(dateKey) === "taken") {
    return successResponse(
      res,
      reminder,
      `Already marked as taken for ${dateKey}`
    );
  }

  reminder.dailyStatus.set(dateKey, "taken");
  reminder.markModified("dailyStatus");
  await reminder.save();

  return successResponse(res, reminder, `Marked as taken for ${dateKey}`);
});

export const markAsMissed = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  }

  const { date } = req.body;
  // Use new Date(date) to parse the provided date string
  const dateKey = date ? getISTDateKey(new Date(date)) : getISTDateKey(); // From utils

  reminder.dailyStatus.set(dateKey, "missed");
  reminder.markModified("dailyStatus");
  await reminder.save();

  return successResponse(res, reminder, `Marked as missed for ${dateKey}`);
});

export const getReminderStats = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id });

  let totalTaken = 0;
  let totalMissed = 0;
  let activeReminders = 0;

  const todayKey = getISTDateKey(); // From utils

  reminders.forEach((reminder) => {
    // Get reminder start/end dates as IST keys for reliable string comparison
    const startKey = getISTDateKey(new Date(reminder.startDate));
    const endKey = reminder.endDate
      ? getISTDateKey(new Date(reminder.endDate))
      : null;

    // Compare using YYYY-MM-DD strings
    const isActive =
      todayKey >= startKey &&
      (!endKey || todayKey <= endKey) &&
      reminder.isActive;

    if (isActive) {
      activeReminders++;
    }

    if (reminder.dailyStatus) {
      reminder.dailyStatus.forEach((status) => {
        if (status === "taken") totalTaken++;
        if (status === "missed") totalMissed++;
      });
    }
  });

  const totalDays = totalTaken + totalMissed;
  const adherenceRate =
    totalDays > 0 ? Math.round((totalTaken / totalDays) * 100) : 0;

  const stats = {
    totalReminders: reminders.length,
    activeReminders,
    totalTaken,
    totalMissed,
    adherenceRate,
  };

  return successResponse(res, stats, "Statistics retrieved successfully");
});
