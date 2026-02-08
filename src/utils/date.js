/**
 * Date utility functions for formatting dates and times
 */

/**
 * Format a date object to YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date object to HH:MM (24-hour format)
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format a date object to HH:MM:SS (24-hour format)
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string with seconds
 */
export function formatTimeWithSeconds(date) {
  if (!date) return '';
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format a date object to YYYY-MM-DD HH:MM
 * @param {Date} date - The date to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(date) {
  if (!date) return '';
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Format a date object to YYYY-MM-DD HH:MM:SS
 * @param {Date} date - The date to format
 * @returns {string} Formatted datetime string with seconds
 */
export function formatDateTimeWithSeconds(date) {
  if (!date) return '';
  return `${formatDate(date)} ${formatTimeWithSeconds(date)}`;
}

/**
 * Format a date to a human-readable string (e.g., "Jan 15, 2026")
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatReadableDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

/**
 * Format a date to a readable datetime string (e.g., "Jan 15, 2026 at 2:30 PM")
 * @param {Date} date - The date to format
 * @returns {string} Formatted datetime string
 */
export function formatReadableDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  return `${d.toLocaleDateString('en-US', dateOptions)} at ${d.toLocaleTimeString('en-US', timeOptions)}`;
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
export function getCurrentDate() {
  return formatDate(new Date());
}

/**
 * Get current time in HH:MM format
 * @returns {string} Current time
 */
export function getCurrentTime() {
  return formatTime(new Date());
}

/**
 * Get current datetime in YYYY-MM-DD HH:MM format
 * @returns {string} Current datetime
 */
export function getCurrentDateTime() {
  return formatDateTime(new Date());
}

/**
 * Parse a date string (YYYY-MM-DD) to a Date object
 * @param {string} dateString - The date string to parse
 * @returns {Date|null} Date object or null if invalid
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Calculate the difference between two dates in days
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in days
 */
export function dateDiffInDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const d = new Date(date);
  const today = new Date();
  return formatDate(d) === formatDate(today);
}

/**
 * Get the start of day (00:00:00)
 * @param {Date} date - The date
 * @returns {Date} Date at start of day
 */
export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of day (23:59:59)
 * @param {Date} date - The date
 * @returns {Date} Date at end of day
 */
export function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
