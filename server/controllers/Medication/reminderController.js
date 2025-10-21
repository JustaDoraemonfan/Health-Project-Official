// controllers/reminderController.js
import asyncHandler from "../../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import Reminder from "../../models/Medication/Reminder.js";

// IST Timezone constant
const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Get current date in IST as YYYY-MM-DD
 */
const getISTDateKey = (date = new Date()) => {
  const istDate = new Date(
    date.toLocaleString("en-US", { timeZone: IST_TIMEZONE })
  );
  return istDate.toISOString().split("T")[0];
};

/**
 * Get yesterday's date in IST as YYYY-MM-DD
 */
const getYesterdayISTKey = () => {
  const now = new Date();
  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: IST_TIMEZONE })
  );
  const yesterday = new Date(istNow);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

/**
 * Normalize date to IST midnight
 */
const normalizeToISTMidnight = (date) => {
  const d = new Date(date);
  const istDate = new Date(
    d.toLocaleString("en-US", { timeZone: IST_TIMEZONE })
  );
  istDate.setHours(0, 0, 0, 0);
  return istDate;
};

/**
 * Get all dates that should be marked as missed
 */
const getMissedDates = (reminder) => {
  if (!reminder.startDate) return [];

  const todayIST = normalizeToISTMidnight(new Date());
  const startDate = normalizeToISTMidnight(reminder.startDate);
  const endDate = reminder.endDate
    ? normalizeToISTMidnight(reminder.endDate)
    : todayIST;

  // Check until yesterday (not today)
  const checkUntil = new Date(
    Math.min(endDate.getTime(), todayIST.getTime() - 86400000)
  );

  if (startDate > checkUntil) return [];

  const missedDates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= checkUntil) {
    const dateKey = getISTDateKey(currentDate);
    const status = reminder.dailyStatus?.get(dateKey);

    // If not marked as taken, it should be missed
    if (status !== "taken") {
      missedDates.push(dateKey);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return missedDates;
};

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

  const todayKey = getISTDateKey();
  const yesterdayKey = getYesterdayISTKey();

  // Process each reminder to mark missed medications
  for (const reminder of reminders) {
    let hasChanges = false;

    // Get all dates that should be marked as missed
    const missedDates = getMissedDates(reminder);

    // Mark each missed date
    for (const dateKey of missedDates) {
      const currentStatus = reminder.dailyStatus?.get(dateKey);
      if (currentStatus !== "taken") {
        reminder.dailyStatus.set(dateKey, "missed");
        reminder.markModified("dailyStatus");
        hasChanges = true;
      }
    }

    // Save only if there were changes
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

  // Update fields
  Object.assign(reminder, req.body);

  // Ensure timezone defaults to IST if not provided
  if (!reminder.timezone) {
    reminder.timezone = IST_TIMEZONE;
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

  // Use IST date for marking as taken
  const dateKey = getISTDateKey();

  // Check if already marked as taken
  if (reminder.dailyStatus?.get(dateKey) === "taken") {
    return successResponse(
      res,
      reminder,
      `Already marked as taken for ${dateKey}`
    );
  }

  // Update dailyStatus map
  reminder.dailyStatus.set(dateKey, "taken");
  reminder.markModified("dailyStatus");

  await reminder.save();

  return successResponse(res, reminder, `Marked as taken for ${dateKey}`);
});

// Optional: Add endpoint to mark as missed manually
export const markAsMissed = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!reminder) {
    return errorResponse(res, "Reminder not found", 404);
  }

  const { date } = req.body;
  const dateKey = date ? getISTDateKey(new Date(date)) : getISTDateKey();

  // Update dailyStatus map
  reminder.dailyStatus.set(dateKey, "missed");
  reminder.markModified("dailyStatus");

  await reminder.save();

  return successResponse(res, reminder, `Marked as missed for ${dateKey}`);
});

// Optional: Get reminder statistics
export const getReminderStats = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id });

  let totalTaken = 0;
  let totalMissed = 0;
  let activeReminders = 0;

  const todayIST = normalizeToISTMidnight(new Date());

  reminders.forEach((reminder) => {
    // Check if reminder is currently active
    const startDate = normalizeToISTMidnight(reminder.startDate);
    const endDate = reminder.endDate
      ? normalizeToISTMidnight(reminder.endDate)
      : null;

    const isActive =
      todayIST >= startDate &&
      (!endDate || todayIST <= endDate) &&
      reminder.isActive;

    if (isActive) {
      activeReminders++;
    }

    // Count taken and missed
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
