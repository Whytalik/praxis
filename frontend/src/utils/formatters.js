/**
 * Format date to locale string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "No date specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format duration in days
 * @param {number} days - Number of days
 * @returns {string} Formatted duration string
 */
export const formatDuration = (days) => {
  if (!days) return "0 days";
  return `${days} day${days === 1 ? "" : "s"}`;
};

/**
 * Capitalize first letter of string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
