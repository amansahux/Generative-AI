/**
 * @file utils/responseFormatter.js
 * @description Utility functions for building consistent HTTP JSON responses.
 */

/**
 * Build a successful API response envelope.
 *
 * @param {*}      data    - The payload to return to the client.
 * @param {string} message - A human-readable success message.
 * @returns {{ success: true, message: string, data: * }}
 */
export const successResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
});

/**
 * Build an error API response envelope.
 *
 * @param {string} message   - A human-readable error description.
 * @param {number} [code]    - Optional application-specific error code.
 * @returns {{ success: false, message: string, code?: number }}
 */
export const errorResponse = (message = "An error occurred", code) => ({
  success: false,
  message,
  ...(code !== undefined && { code }),
});

/**
 * Build a paginated API response envelope.
 *
 * @param {Array}  items      - The result items for the current page.
 * @param {number} total      - Total number of items across all pages.
 * @param {number} page       - Current page number (1-indexed).
 * @param {number} limit      - Number of items per page.
 * @returns {{ success: true, data: Array, pagination: Object }}
 */
export const paginatedResponse = (items, total, page, limit) => ({
  success: true,
  data: items,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});
