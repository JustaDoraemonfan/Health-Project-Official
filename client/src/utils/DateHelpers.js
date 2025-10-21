// dateUtils.js
// All date operations in Indian Standard Time (IST)

const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Get current date in IST, normalized to midnight
 */
export const getTodayIST = () => {
  const now = new Date();
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: IST_TIMEZONE })
  );
  istDate.setHours(0, 0, 0, 0);
  return istDate;
};

/**
 * Get yesterday's date in IST
 */
export const getYesterdayIST = () => {
  const today = getTodayIST();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

/**
 * Convert any date to IST midnight
 */
export const normalizeToISTMidnight = (date) => {
  const d = new Date(date);
  const istDate = new Date(
    d.toLocaleString("en-US", { timeZone: IST_TIMEZONE })
  );
  istDate.setHours(0, 0, 0, 0);
  return istDate;
};

/**
 * Get ISO date string (YYYY-MM-DD) for IST date
 */
export const getISTDateKey = (date = new Date()) => {
  const istDate = new Date(
    date.toLocaleString("en-US", { timeZone: IST_TIMEZONE })
  );
  return istDate.toISOString().split("T")[0];
};

/**
 * Check if a reminder is active today (IST)
 */
export const isReminderActiveToday = (reminder) => {
  const today = getTodayIST();
  const startDate = normalizeToISTMidnight(reminder.startDate);
  const endDate = reminder.endDate
    ? normalizeToISTMidnight(reminder.endDate)
    : null;

  return today >= startDate && (!endDate || today <= endDate);
};

/**
 * Check if medication period has ended
 */
export const isMedicationEnded = (endDate) => {
  if (!endDate) return false;
  const today = getTodayIST();
  const end = normalizeToISTMidnight(endDate);
  return end < today;
};

/**
 * Compare two dates (IST normalized)
 */
export const areDatesEqual = (date1, date2) => {
  const d1 = normalizeToISTMidnight(date1);
  const d2 = normalizeToISTMidnight(date2);
  return d1.getTime() === d2.getTime();
};

/**
 * Format time in 12-hour format
 */
export const formatTime = (time) => {
  if (!time) return "—";
  const [hoursStr, minutes] = time.split(":");
  const hours = parseInt(hoursStr, 10);
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Get reminder status for today
 */
export const getReminderStatus = (reminder) => {
  const todayKey = getISTDateKey();
  return reminder.dailyStatus?.[todayKey] || "upcoming";
};

/**
 * Sort reminders by time (earliest first)
 */
export const sortRemindersByTime = (reminders) => {
  return [...reminders].sort((a, b) => {
    const aTime = a.times?.[0] || "00:00";
    const bTime = b.times?.[0] || "00:00";
    const aDate = new Date(`${a.startDate}T${aTime}`);
    const bDate = new Date(`${b.startDate}T${bTime}`);
    return aDate - bDate;
  });
};

/**
 * Get all dates that should be marked as missed for a reminder
 * Returns array of date keys (YYYY-MM-DD) that are:
 * - Between start and yesterday (inclusive)
 * - Not marked as "taken" in dailyStatus
 * - Within the medication period
 */
export const getMissedDates = (reminder) => {
  if (!reminder.startDate) return [];

  const today = getTodayIST();
  const startDate = normalizeToISTMidnight(reminder.startDate);
  const endDate = reminder.endDate
    ? normalizeToISTMidnight(reminder.endDate)
    : today;

  // Don't check future dates or today
  const checkUntil = new Date(
    Math.min(
      endDate.getTime(),
      today.getTime() - 86400000 // yesterday
    )
  );

  if (startDate > checkUntil) return []; // Medication hasn't started yet

  const missedDates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= checkUntil) {
    const dateKey = getISTDateKey(currentDate);
    const status = reminder.dailyStatus?.[dateKey];

    // If not marked as taken, it's missed
    if (status !== "taken") {
      missedDates.push(dateKey);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return missedDates;
};

/**
 * Calculate adherence percentage for a reminder
 * Returns percentage of days where medication was taken vs should have been taken
 */
export const calculateAdherence = (reminder) => {
  if (!reminder.startDate || !reminder.dailyStatus) return 0;

  const today = getTodayIST();
  const startDate = normalizeToISTMidnight(reminder.startDate);
  const endDate = reminder.endDate
    ? normalizeToISTMidnight(reminder.endDate)
    : today;

  const checkUntil = new Date(Math.min(endDate.getTime(), today.getTime()));

  if (startDate > checkUntil) return 0; // Not started yet

  let totalDays = 0;
  let takenDays = 0;
  let currentDate = new Date(startDate);

  while (currentDate < checkUntil) {
    // Don't include today
    const dateKey = getISTDateKey(currentDate);
    totalDays++;

    if (reminder.dailyStatus[dateKey] === "taken") {
      takenDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalDays > 0 ? Math.round((takenDays / totalDays) * 100) : 0;
};
