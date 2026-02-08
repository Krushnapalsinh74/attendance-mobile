/**
 * Date Utility Functions
 * Handles date formatting, parsing, and manipulation for the attendance system
 */

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format date to DD/MM/YYYY
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatDateDisplay = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format time to HH:MM
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Format date and time to DD/MM/YYYY HH:MM
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return `${formatDateDisplay(d)} ${formatTime(d)}`;
};

/**
 * Get current date as YYYY-MM-DD
 * @returns {string} Current date
 */
export const getCurrentDate = () => {
  return formatDate(new Date());
};

/**
 * Get current time as HH:MM
 * @returns {string} Current time
 */
export const getCurrentTime = () => {
  return formatTime(new Date());
};

/**
 * Get current datetime as ISO string
 * @returns {string} Current datetime
 */
export const getCurrentDateTime = () => {
  return new Date().toISOString();
};

/**
 * Parse date string to Date object
 * @param {string} dateString - Date string in various formats
 * @returns {Date|null} Date object or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Get date range (start and end of day)
 * @param {Date|string} date - Date object or date string
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRange = (date) => {
  const d = new Date(date);
  
  const startDate = new Date(d);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(d);
  endDate.setHours(23, 59, 59, 999);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

/**
 * Add days to a date
 * @param {Date|string} date - Date object or date string
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Get difference between two dates in days
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

/**
 * Get month name
 * @param {number} month - Month number (0-11)
 * @returns {string} Month name
 */
export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month] || '';
};

/**
 * Get day name
 * @param {Date|string} date - Date object or date string
 * @returns {string} Day name
 */
export const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(date);
  return days[d.getDay()] || '';
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date object or date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDateDisplay(d);
};
