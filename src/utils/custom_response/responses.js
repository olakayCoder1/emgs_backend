const statusCodes = require('./statusCodes');  // Your status code utility file (optional)

const successResponse = (data = null, res, statusCode = 200, message="Success") => {
    const responseData = {
        status: true,
        message:message,
        detail:message,
        data
    };
    return res.status(statusCode).json(responseData);
};

const errorResponse = (message = 'An error occurred', group = 'BAD_REQUEST', statusCode = 400, res) => {
    const responseData = {
        status: false,
        group,
        detail: message,
        message
    };
    return res.status(statusCode).json(responseData);
};

const validationErrorResponse = (errors = null, res) => {
    const message = 'Validation failed';
    const responseData = {
        status: false,
        message,
        detail: message,
        errors
    };
    return res.status(422).json(responseData);
};

const verificationSuccessResponse = (data = null, message = 'Success', responseCode = '00', statusCode = 200, statusBool = true, res) => {
    const responseData = {
        status: statusBool,
        message,
        detail: message,
        response_code: responseCode,
        data
    };
    return res.status(statusCode).json(responseData);
};

const badRequestResponse = (message = 'Bad Request', group = 'BAD_REQUEST', statusCode = 400, res) => {
    return errorResponse(message, group, statusCode, res);
};

const internalServerErrorResponse = (message = 'Internal Server Error', res, statusCode = 500) => {
    return errorResponse(message, 'INTERNAL_SERVER_ERROR', statusCode, res);
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
    verificationSuccessResponse,
    badRequestResponse,
    internalServerErrorResponse
};