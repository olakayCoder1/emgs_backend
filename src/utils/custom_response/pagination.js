/**
 * Utility function for creating paginated responses
 * 
 * @param {Array} data - The array of items for the current page
 * @param {number} totalItems - Total number of items across all pages
 * @param {number} currentPage - The current page number
 * @param {number} limit - Number of items per page
 * @param {Object} res - Express response object
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code for the response
 * @returns {Object} Express response with standardized pagination format
 */
const paginationResponse = (
    data,
    totalItems,
    currentPage = 1,
    limit = 10,
    res,
    message = 'Success',
    statusCode = 200
  ) => {
    // Ensure currentPage and limit are numbers
    currentPage = parseInt(currentPage);
    limit = parseInt(limit);
  
    // Calculate pagination values
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
  
    // Create response object
    const responseData = {
      status: true,
      message,
      detail: message,
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null
      }
    };
  
    return res.status(statusCode).json(responseData);
  };
  
  module.exports = {
    paginationResponse
  };