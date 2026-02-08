/**
 * Validation Utility Functions
 * Handles validation for various data types in the attendance system
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date format
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validate time format (HH:MM)
 * @param {string} timeString - Time string to validate
 * @returns {boolean} True if valid time format
 */
export const isValidTime = (timeString) => {
  if (!timeString) return false;
  
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeString);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Object with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {Object} Object with isValid and message
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Name of the field
 * @returns {Object} Object with isValid and message
 */
export const validateLength = (value, min, max, fieldName = 'Field') => {
  if (!value) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (value.length < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min} characters` };
  }
  
  if (max && value.length > max) {
    return { isValid: false, message: `${fieldName} must be no more than ${max} characters` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate numeric value
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {Object} Object with isValid and message
 */
export const validateNumeric = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (isNaN(Number(value))) {
    return { isValid: false, message: `${fieldName} must be a number` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate numeric range
 * @param {any} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field
 * @returns {Object} Object with isValid and message
 */
export const validateRange = (value, min, max, fieldName = 'Field') => {
  const numericCheck = validateNumeric(value, fieldName);
  if (!numericCheck.isValid) return numericCheck;
  
  const numValue = Number(value);
  
  if (numValue < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min}` };
  }
  
  if (numValue > max) {
    return { isValid: false, message: `${fieldName} must be no more than ${max}` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate coordinate (latitude or longitude)
 * @param {number} value - Coordinate value
 * @param {string} type - 'latitude' or 'longitude'
 * @returns {boolean} True if valid coordinate
 */
export const isValidCoordinate = (value, type = 'latitude') => {
  if (typeof value !== 'number') return false;
  
  if (type === 'latitude') {
    return value >= -90 && value <= 90;
  }
  
  if (type === 'longitude') {
    return value >= -180 && value <= 180;
  }
  
  return false;
};

/**
 * Validate location object
 * @param {Object} location - Location object with latitude and longitude
 * @returns {Object} Object with isValid and message
 */
export const validateLocation = (location) => {
  if (!location) {
    return { isValid: false, message: 'Location is required' };
  }
  
  if (!isValidCoordinate(location.latitude, 'latitude')) {
    return { isValid: false, message: 'Invalid latitude' };
  }
  
  if (!isValidCoordinate(location.longitude, 'longitude')) {
    return { isValid: false, message: 'Invalid longitude' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate form with multiple fields
 * @param {Object} formData - Form data object
 * @param {Object} rules - Validation rules object
 * @returns {Object} Object with isValid, errors, and messages
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = formData[field];
    
    // Required check
    if (rule.required) {
      const result = validateRequired(value, rule.label || field);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        continue;
      }
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rule.required) continue;
    
    // Email validation
    if (rule.type === 'email' && !isValidEmail(value)) {
      errors[field] = `Invalid email format`;
      isValid = false;
    }
    
    // Phone validation
    if (rule.type === 'phone' && !isValidPhone(value)) {
      errors[field] = `Invalid phone number`;
      isValid = false;
    }
    
    // Date validation
    if (rule.type === 'date' && !isValidDate(value)) {
      errors[field] = `Invalid date format`;
      isValid = false;
    }
    
    // Time validation
    if (rule.type === 'time' && !isValidTime(value)) {
      errors[field] = `Invalid time format`;
      isValid = false;
    }
    
    // Length validation
    if (rule.minLength || rule.maxLength) {
      const result = validateLength(value, rule.minLength, rule.maxLength, rule.label || field);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
    
    // Custom validation function
    if (rule.custom && typeof rule.custom === 'function') {
      const result = rule.custom(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
};

/**
 * Sanitize string (remove HTML tags and special characters)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
};

/**
 * Validate file upload
 * @param {File} file - File object
 * @param {Object} options - Validation options (maxSize, allowedTypes)
 * @returns {Object} Object with isValid and message
 */
export const validateFile = (file, options = {}) => {
  if (!file) {
    return { isValid: false, message: 'File is required' };
  }
  
  const { maxSize, allowedTypes } = options;
  
  // Check file size (maxSize in MB)
  if (maxSize && file.size > maxSize * 1024 * 1024) {
    return { isValid: false, message: `File size must be less than ${maxSize}MB` };
  }
  
  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type;
    const isAllowed = allowedTypes.some(type => fileType.includes(type));
    
    if (!isAllowed) {
      return { isValid: false, message: `File type must be one of: ${allowedTypes.join(', ')}` };
    }
  }
  
  return { isValid: true, message: '' };
};
