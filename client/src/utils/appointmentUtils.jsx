// utils/appointmentUtils.js

/**
 * Get CSS classes for appointment status badges
 * @param {string} status - The appointment status
 * @returns {string} - CSS class string for the status
 */
export const getStatusClass = (status) => {
  const statusClasses = {
    confirmed: "bg-green-800/40 text-white border-green-700/50",
    pending: "bg-yellow-800/40 text-white border-yellow-700/50",
    scheduled: "bg-blue-800/40 text-white border-blue-700/50",
    "cancelled-by-patient": "bg-red-800/40 text-white border-red-700/50",
    "cancelled-by-doctor": "bg-red-800/40 text-white border-red-700/50",
    completed: "bg-emerald-800/40 text-white border-emerald-700/50", // if you track completed appointments
    "no-show": "bg-orange-800/40 text-white border-orange-700/50", // if you track no-shows
    rescheduled: "bg-purple-800/40 text-white border-purple-700/50", // if you track rescheduled appointments
  };
  return (
    statusClasses[status] || "bg-gray-900/20 text-gray-400 border-gray-700/50"
  );
};

/**
 * Format date for display (full version)
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long", // Friday
    month: "short", // Sep
    day: "numeric", // 26
    year: "numeric", // 2025
  });
};

/**
 * Format time for display
 * @param {string|Date} date - The date or date+time string
 * @returns {string} - Formatted time string
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // AM/PM
  });
};

/**
 * Get initials from a name
 * @param {string} name - The full name
 * @returns {string} - First letter of the name or 'U' for unknown
 */
export const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

/**
 * Get appointment ID short version (last 6 characters)
 * @param {string} id - The full appointment ID
 * @returns {string} - Last 6 characters of the ID
 */
export const getShortId = (id) => {
  return id ? id.slice(-6) : "N/A";
};
