import { subDays, eachDayOfInterval, min } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

// IST Timezone constant
export const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Helper function to get the current time in IST as a Date object.
 * @returns {Date}
 */
export const nowInIST = () => {
  return toZonedTime(new Date(), IST_TIMEZONE);
};

/**
 * Get a date formatted as 'yyyy-MM-dd' in the IST timezone.
 * @param {Date | number | string} [date=new Date()] - The date to format.
 * @returns {string} The date formatted as yyyy-MM-dd.
 */
export const getISTDateKey = (date = new Date()) => {
  return formatInTimeZone(date, IST_TIMEZONE, "yyyy-MM-dd");
};

/**
 * Get yesterday's date as 'yyyy-MM-dd' in the IST timezone.
 * @returns {string} Yesterday's date formatted as yyyy-MM-dd.
 */
export const getYesterdayISTKey = () => {
  const now = new Date();
  const yesterday = subDays(now, 1);
  return formatInTimeZone(yesterday, IST_TIMEZONE, "yyyy-MM-dd");
};

/**
 * Get all dates from the reminder's start until yesterday (in IST)
 * that are not marked as "taken".
 * @param {object} reminder - The reminder object from MongoDB.
 * @returns {string[]} An array of date keys (yyyy-MM-dd) that are missed.
 */
export const getMissedDates = (reminder) => {
  if (!reminder.startDate) return [];

  // Get current date and yesterday
  const now = new Date();
  const yesterday = subDays(now, 1);

  // Parse the start and end dates (assuming they're stored as ISO strings or Date objects)
  const startDate = new Date(reminder.startDate);
  const endDate = reminder.endDate ? new Date(reminder.endDate) : now;

  // Check until yesterday or the reminder's end date, whichever is earlier
  const checkUntil = min([yesterday, endDate]);

  // If the start date is after the check-until date, there's nothing to miss
  if (startDate > checkUntil) {
    return [];
  }

  // Get an array of all days from the start date to the check-until date
  const dateInterval = eachDayOfInterval({
    start: startDate,
    end: checkUntil,
  });

  const missedDates = [];
  for (const day of dateInterval) {
    // Format each day as an IST date key
    const dateKey = formatInTimeZone(day, IST_TIMEZONE, "yyyy-MM-dd");
    const status = reminder.dailyStatus?.get(dateKey);

    // If not marked as taken, it's missed
    if (status !== "taken") {
      missedDates.push(dateKey);
    }
  }

  return missedDates;
};
