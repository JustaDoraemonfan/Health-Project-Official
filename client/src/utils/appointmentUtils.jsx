// utils/appointmentUtils.js

/**
 * Get CSS classes for appointment status badges
 * @param {string} status - The appointment status
 * @returns {string} - CSS class string for the status
 */
export const getStatusClass = (status) => {
  const statusClasses = {
    confirmed: "bg-green-800 text-green-400 border-green-700/50",
    pending: "bg-yellow-800 text-yellow-400 border-yellow-700/50",
    cancelled: "bg-red-800 text-red-400 border-red-700/50",
    scheduled: "bg-blue-800 text-blue-400 border-blue-700/50",
  };
  return (
    statusClasses[status] || "bg-gray-900/20 text-gray-400 border-gray-700/50"
  );
};

/**
 * Format date for display
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
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
