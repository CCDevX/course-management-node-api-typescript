"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErrorHandler = defaultErrorHandler;
const logger_1 = require("../logger");
// Custom Express error-handling middleware function
function defaultErrorHandler(err, request, response, next) {
    logger_1.logger.error(`Default error handler triggered; reason: `, err);
    // Check if the response has already started being sent
    if (response.headersSent) {
        // If headers are already sent, we can't modify the response
        // Delegate to the built-in Express error handler
        logger_1.logger.error(`Response was already being written, delegating to built-in Express error handler.`);
        return next(err);
    }
    // If no response was sent yet, return a generic 500 error to the client
    response.status(500).json({
        status: "error",
        message: "Default error handling triggered, check logs.",
    });
}
