"use server";

/**
 * Centralized error handling utility for server actions
 * Ensures consistent error response format across the application
 */

/**
 * Wrap server actions with standardized error handling
 * @param {Function} fn - The server action function to wrap
 * @returns {Function} - Wrapped function that returns {success, data, error}
 */
export function withErrorHandler(fn) {
  return async (...args) => {
    try {
      const result = await fn(...args);
      
      // If result already has success/error structure, return as-is
      if (result && typeof result === 'object' && 'success' in result) {
        return result;
      }
      
      // Otherwise wrap in success response
      return { success: true, data: result };
    } catch (error) {
      console.error(`Error in ${fn.name}:`, error);
      
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        code: error.code || 'UNKNOWN_ERROR'
      };
    }
  };
}

/**
 * Create a standardized error response
 * @param {string} message - Error message to display to user
 * @param {string} code - Error code for debugging
 * @returns {Object} - Error response object
 */
export function createErrorResponse(message, code = 'ERROR') {
  return {
    success: false,
    error: message,
    code: code
  };
}

/**
 * Create a standardized success response
 * @param {any} data - Data to return
 * @returns {Object} - Success response object
 */
export function createSuccessResponse(data) {
  return {
    success: true,
    data: data
  };
}
