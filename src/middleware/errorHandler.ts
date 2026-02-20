import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (_request: Request, response: Response) => {
  response.status(404).json({
    success: false,
    message: 'Route not found'
  });
};

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  logger.error(message);

  response.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.'
  });
};
