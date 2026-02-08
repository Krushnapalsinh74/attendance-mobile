/**
 * Error Handler Utility
 * Centralized error handling for API requests
 */

class ErrorHandler {
  /**
   * Handle API errors and return user-friendly messages
   * @param {Error} error - The error object from API call
   * @param {string} context - Context where error occurred (optional)
   * @returns {Object} Formatted error response
   */
  static handleError(error, context = '') {
    const errorResponse = {
      success: false,
      message: '',
      details: null,
      statusCode: null,
      context: context
    };

    // Network errors
    if (!error.response) {
      if (error.request) {
        // Request was made but no response received
        errorResponse.message = 'No response from server. Please check your internet connection.';
        errorResponse.statusCode = 0;
        errorResponse.details = 'NETWORK_ERROR';
      } else {
        // Something happened in setting up the request
        errorResponse.message = 'Failed to make request. Please try again.';
        errorResponse.details = error.message;
      }
      console.error(`[${context}] Network Error:`, error);
      return errorResponse;
    }

    // HTTP errors with response
    const status = error.response.status;
    errorResponse.statusCode = status;

    switch (status) {
      case 400:
        errorResponse.message = error.response.data?.message || 'Invalid request. Please check your input.';
        errorResponse.details = 'BAD_REQUEST';
        break;

      case 401:
        errorResponse.message = 'Session expired. Please login again.';
        errorResponse.details = 'UNAUTHORIZED';
        // Optionally trigger logout
        this.handleUnauthorized();
        break;

      case 403:
        errorResponse.message = 'You do not have permission to perform this action.';
        errorResponse.details = 'FORBIDDEN';
        break;

      case 404:
        errorResponse.message = 'Resource not found.';
        errorResponse.details = 'NOT_FOUND';
        break;

      case 422:
        errorResponse.message = error.response.data?.message || 'Validation failed.';
        errorResponse.details = error.response.data?.errors || 'VALIDATION_ERROR';
        break;

      case 429:
        errorResponse.message = 'Too many requests. Please try again later.';
        errorResponse.details = 'RATE_LIMIT_EXCEEDED';
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        errorResponse.message = 'Server error. Please try again later.';
        errorResponse.details = 'SERVER_ERROR';
        break;

      default:
        errorResponse.message = error.response.data?.message || 'An unexpected error occurred.';
        errorResponse.details = 'UNKNOWN_ERROR';
    }

    console.error(`[${context}] API Error [${status}]:`, error.response.data || error.message);
    return errorResponse;
  }

  /**
   * Handle unauthorized access (401)
   * Clear storage and redirect to login
   */
  static handleUnauthorized() {
    try {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Error handling unauthorized access:', err);
    }
  }

  /**
   * Log errors for debugging (can be extended to send to logging service)
   * @param {Object} error - Error object
   * @param {string} context - Context information
   */
  static logError(error, context = '') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      context,
      error: {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      }
    };

    console.error('Error Log:', logEntry);
    
    // TODO: Send to external logging service if needed
    // Example: send to Sentry, LogRocket, etc.
  }

  /**
   * Show user-friendly error notification
   * @param {string} message - Error message to display
   */
  static showNotification(message) {
    // This can be customized based on your notification system
    // Example implementations:
    
    // 1. Browser alert (basic)
    // alert(message);
    
    // 2. Toast notification (if using a library like react-toastify)
    // toast.error(message);
    
    // 3. Custom notification component
    console.log('Notification:', message);
    
    // For now, just log to console
    // Replace with your actual notification implementation
  }

  /**
   * Validate response data
   * @param {Object} response - API response
   * @returns {boolean} Whether response is valid
   */
  static isValidResponse(response) {
    return response && 
           response.data && 
           typeof response.data === 'object';
  }

  /**
   * Extract error message from various error formats
   * @param {Error} error - Error object
   * @returns {string} Extracted error message
   */
  static extractErrorMessage(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}

export default ErrorHandler;
