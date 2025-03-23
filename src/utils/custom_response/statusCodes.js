module.exports = {
    OK: 200,                             // Success
    CREATED: 201,                        // Resource created
    ACCEPTED: 202,                       // Request accepted, but processing is not complete
    NO_CONTENT: 204,                     // Successful request, but no content to return
    BAD_REQUEST: 400,                    // Invalid request, typically due to user input
    UNAUTHORIZED: 401,                   // Missing or invalid authentication
    FORBIDDEN: 403,                      // User does not have permission to access the resource
    NOT_FOUND: 404,                      // Resource not found
    METHOD_NOT_ALLOWED: 405,             // HTTP method not allowed
    NOT_ACCEPTABLE: 406,                 // Resource is not available in the requested format
    CONFLICT: 409,                       // Conflict between the request and the current state of the resource
    GONE: 410,                           // Resource no longer available
    UNPROCESSABLE_ENTITY: 422,           // Validation failed, or invalid data provided
    INTERNAL_SERVER_ERROR: 500,          // Server error
    NOT_IMPLEMENTED: 501,                // Server does not support the functionality required
    BAD_GATEWAY: 502,                    // Invalid response from an upstream server
    SERVICE_UNAVAILABLE: 503,            // Server unavailable due to temporary overload or maintenance
    GATEWAY_TIMEOUT: 504,                // Upstream server timeout
    HTTP_VERSION_NOT_SUPPORTED: 505,     // HTTP version not supported
    NETWORK_AUTHENTICATION_REQUIRED: 511 // Authentication required to access the network
};
