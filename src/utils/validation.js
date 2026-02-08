/**
 * Validation Utilities
 * Common validation functions for forms and user input
 */

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  
  // Basic format check
  if (!emailRegex.test(trimmedEmail)) return false;
  
  // Additional checks
  if (trimmedEmail.length > 254) return false; // RFC 5321
  if (trimmedEmail.indexOf('..') !== -1) return false; // No consecutive dots
  
  return true;
};

/**
 * Validate phone number (supports multiple formats)
 * @param {string} phone - Phone number to validate
 * @param {string} country - Country code (default: 'IN' for India)
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone, country = 'IN') => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (country === 'IN') {
    // Indian phone numbers: 10 digits starting with 6-9
    return /^[6-9]\d{9}$/.test(cleaned);
  }
  
  // Generic validation: 10-15 digits
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} {valid: boolean, errors: string[]}
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = false
  } = options;
  
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate required field (non-empty string)
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} {valid: boolean, error: string}
 */
export const isRequired = (value, fieldName = 'This field') => {
  const isValid = value !== null && 
                  value !== undefined && 
                  String(value).trim().length > 0;
  
  return {
    valid: isValid,
    error: isValid ? null : `${fieldName} is required`
  };
};

/**
 * Validate string length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {Object} {valid: boolean, error: string}
 */
export const validateLength = (value, min = 0, max = Infinity) => {
  if (!value) return { valid: false, error: 'Value is required' };
  
  const length = String(value).trim().length;
  
  if (length < min) {
    return { valid: false, error: `Must be at least ${min} characters` };
  }
  
  if (length > max) {
    return { valid: false, error: `Must be no more than ${max} characters` };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate numeric value
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} {valid: boolean, error: string}
 */
export const isValidNumber = (value, options = {}) => {
  const { min, max, integer = false } = options;
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { valid: false, error: 'Must be an integer' };
  }
  
  if (min !== undefined && num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { valid: false, error: `Must be no more than ${max}` };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @returns {Object} {valid: boolean, error: string}
 */
export const isValidDate = (date, options = {}) => {
  const { min, max, future = false, past = false } = options;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }
  
  const now = new Date();
  
  if (future && dateObj <= now) {
    return { valid: false, error: 'Date must be in the future' };
  }
  
  if (past && dateObj >= now) {
    return { valid: false, error: 'Date must be in the past' };
  }
  
  if (min && dateObj < new Date(min)) {
    return { valid: false, error: `Date must be after ${min}` };
  }
  
  if (max && dateObj > new Date(max)) {
    return { valid: false, error: `Date must be before ${max}` };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate employee ID format
 * @param {string} employeeId - Employee ID to validate
 * @returns {boolean} True if valid format
 */
export const isValidEmployeeId = (employeeId) => {
  if (!employeeId || typeof employeeId !== 'string') return false;
  
  // Example format: EMP001, EMP1234 (customizable based on your format)
  const empIdRegex = /^[A-Z]{2,4}\d{3,6}$/;
  return empIdRegex.test(employeeId.trim().toUpperCase());
};

/**
 * Sanitize string input (remove potentially harmful characters)
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .slice(0, 500); // Limit length
};

/**
 * Validate form fields
 * @param {Object} fields - Object with field values
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} {valid: boolean, errors: Object}
 */
export const validateForm = (fields, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = fields[fieldName];
    
    fieldRules.forEach(rule => {
      if (rule.type === 'required') {
        const result = isRequired(fieldValue, fieldName);
        if (!result.valid) {
          errors[fieldName] = result.error;
          isValid = false;
        }
      } else if (rule.type === 'email') {
        if (fieldValue && !isValidEmail(fieldValue)) {
          errors[fieldName] = 'Invalid email format';
          isValid = false;
        }
      } else if (rule.type === 'phone') {
        if (fieldValue && !isValidPhone(fieldValue, rule.country)) {
          errors[fieldName] = 'Invalid phone number';
          isValid = false;
        }
      } else if (rule.type === 'length') {
        const result = validateLength(fieldValue, rule.min, rule.max);
        if (!result.valid) {
          errors[fieldName] = result.error;
          isValid = false;
        }
      } else if (rule.type === 'custom' && typeof rule.validator === 'function') {
        const result = rule.validator(fieldValue);
        if (!result.valid) {
          errors[fieldName] = result.error;
          isValid = false;
        }
      }
    });
  });
  
  return { valid: isValid, errors };
};

export default {
  isValidEmail,
  isValidPhone,
  validatePassword,
  isRequired,
  validateLength,
  isValidNumber,
  isValidURL,
  isValidDate,
  isValidEmployeeId,
  sanitizeString,
  validateForm
};
