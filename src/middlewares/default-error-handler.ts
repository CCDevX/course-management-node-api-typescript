import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

// Custom Express error-handling middleware function
export function defaultErrorHandler(
  err: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  logger.error(`Default error handler triggered; reason: `, err);

  // Check if the response has already started being sent
  if (response.headersSent) {
    // If headers are already sent, we can't modify the response
    // Delegate to the built-in Express error handler
    logger.error(
      `Response was already being written, delegating to built-in Express error handler.`
    );
    return next(err);
  }

  // If no response was sent yet, return a generic 500 error to the client
  response.status(500).json({
    status: "error",
    message: "Default error handling triggered, check logs.",
  });
}
